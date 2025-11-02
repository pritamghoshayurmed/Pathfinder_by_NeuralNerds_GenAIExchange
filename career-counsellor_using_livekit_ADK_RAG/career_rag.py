"""
Low-Latency RAG System for Career Advice using FAISS and Gemini Embeddings
Optimized for production use with minimal latency
"""

import os
import json
import pickle
import numpy as np
from typing import List, Tuple, Optional
from dotenv import load_dotenv
import faiss
import google.generativeai as genai
from functools import lru_cache
import time
import random
from time import sleep

load_dotenv()

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not set in environment variables")

genai.configure(api_key=API_KEY)

class CareerRAGSystem:
    """
    Low-latency RAG system for career advice using FAISS for retrieval
    and Gemini for embeddings and response generation.
    
    Key features:
    - Ultra-fast retrieval using FAISS
    - Cached embeddings for minimal API calls
    - Batch processing for efficiency
    - Optimized for production use
    """
    
    def __init__(self, knowledge_base_path: str = "career_knowledge_base.txt"):
        """
        Initialize the RAG system.
        
        Args:
            knowledge_base_path: Path to the career knowledge base text file
        """
        self.knowledge_base_path = knowledge_base_path
        self.index = None
        self.documents = []
        self.metadata = []
        self.embedding_dim = 768  # Gemini embedding dimension
        self.index_path = "career_rag_index.faiss"
        self.metadata_path = "career_rag_metadata.pkl"
        
    def load_knowledge_base(self) -> List[str]:
        """
        Load and chunk the knowledge base document into smaller segments.
        Uses intelligent chunking based on section headers.
        
        Returns:
            List of document chunks
        """
        print(f"Loading knowledge base from {self.knowledge_base_path}...")
        
        if not os.path.exists(self.knowledge_base_path):
            raise FileNotFoundError(f"Knowledge base not found at {self.knowledge_base_path}")
        
        with open(self.knowledge_base_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Split by section headers for better chunking
        sections = content.split('\n================================================================================\n')
        
        documents = []
        for section in sections:
            if len(section.strip()) < 50:
                continue
            
            # Further split long sections into smaller chunks (~500 chars each)
            lines = section.split('\n')
            current_chunk = []
            current_length = 0
            
            for line in lines:
                current_chunk.append(line)
                current_length += len(line)
                
                if current_length > 500:
                    chunk_text = '\n'.join(current_chunk).strip()
                    if len(chunk_text) > 50:
                        documents.append(chunk_text)
                    current_chunk = []
                    current_length = 0
            
            # Add remaining chunk
            if current_chunk:
                chunk_text = '\n'.join(current_chunk).strip()
                if len(chunk_text) > 50:
                    documents.append(chunk_text)
        
        print(f"✓ Loaded {len(documents)} document chunks")
        self.documents = documents
        return documents
    
    def _get_embedding_with_retry(self, text: str, max_retries: int = 5) -> np.ndarray:
        """
        Get embedding for text with exponential backoff retry logic.
        Handles 504 Deadline Exceeded errors gracefully.
        
        Args:
            text: Text to embed
            max_retries: Maximum number of retry attempts
            
        Returns:
            Embedding vector as numpy array
        """
        # Truncate text to avoid API limits
        text = text[:2000]
        
        for attempt in range(max_retries):
            try:
                # Use embedding-001 for low latency
                result = genai.embed_content(
                    model="models/embedding-001",
                    content=text,
                    task_type="RETRIEVAL_DOCUMENT",
                    title="Career advice document"
                )
                embedding = np.array(result['embedding'], dtype=np.float32)
                return embedding
                
            except Exception as e:
                error_str = str(e)
                
                # Check if it's a deadline exceeded error
                if "504" in error_str or "Deadline" in error_str or "timeout" in error_str.lower():
                    if attempt < max_retries - 1:
                        # Exponential backoff with jitter
                        wait_time = (2 ** attempt) + random.uniform(0, 1)
                        print(f"  ⚠ API timeout (attempt {attempt + 1}/{max_retries}). Retrying in {wait_time:.1f}s...")
                        sleep(wait_time)
                        continue
                    else:
                        print(f"  ✗ Failed after {max_retries} retries: {error_str}")
                        return np.zeros(768, dtype=np.float32)
                else:
                    # Non-timeout error, don't retry
                    print(f"  ✗ Error embedding text (non-timeout): {error_str}")
                    return np.zeros(768, dtype=np.float32)
        
        # Fallback
        return np.zeros(768, dtype=np.float32)
    
    def build_index(self, force_rebuild: bool = False) -> bool:
        """
        Build FAISS index from documents.
        Uses cached index if available.
        Includes smart retry logic and request throttling.
        
        Args:
            force_rebuild: Force rebuild even if index exists
            
        Returns:
            True if index was built successfully
        """
        # Check if index exists and is valid
        if not force_rebuild and os.path.exists(self.index_path):
            try:
                print("Loading existing FAISS index...")
                self.index = faiss.read_index(self.index_path)
                with open(self.metadata_path, 'rb') as f:
                    self.metadata = pickle.load(f)
                print(f"✓ Loaded index with {self.index.ntotal} documents")
                return True
            except Exception as e:
                print(f"Could not load existing index: {e}")
        
        # Build new index
        print("Building FAISS index from documents...")
        
        if not self.documents:
            self.load_knowledge_base()
        
        # Create FAISS index
        # Using IndexFlatL2 for exact search with low latency
        self.index = faiss.IndexFlatL2(self.embedding_dim)
        
        # Generate embeddings for all documents in batches with throttling
        embeddings = []
        batch_size = 5  # Reduced batch size to avoid rate limiting
        total_batches = (len(self.documents) - 1) // batch_size + 1
        
        for i in range(0, len(self.documents), batch_size):
            batch = self.documents[i:i+batch_size]
            batch_num = i // batch_size + 1
            print(f"Processing batch {batch_num}/{total_batches}...")
            
            for doc_idx, doc in enumerate(batch):
                try:
                    embedding = self._get_embedding_with_retry(doc, max_retries=5)
                    embeddings.append(embedding)
                    
                    # Add delay between requests to avoid rate limiting
                    if doc_idx < len(batch) - 1:  # Don't sleep after last doc in batch
                        sleep(0.5)  # 500ms delay between requests
                        
                except Exception as e:
                    print(f"  ✗ Failed to embed document: {e}")
                    embeddings.append(np.zeros(768, dtype=np.float32))
            
            # Longer delay between batches
            if i + batch_size < len(self.documents):
                print(f"  ⏸ Waiting between batches...")
                sleep(1.5)
        
        # Convert to numpy array and add to index
        embeddings_array = np.array(embeddings, dtype=np.float32)
        self.index.add(embeddings_array)
        
        # Store metadata
        self.metadata = [
            {
                'text': doc,
                'index': i
            }
            for i, doc in enumerate(self.documents)
        ]
        
        # Save index and metadata to disk
        faiss.write_index(self.index, self.index_path)
        with open(self.metadata_path, 'wb') as f:
            pickle.dump(self.metadata, f)
        
        print(f"✓ Built index with {self.index.ntotal} documents")
        print(f"✓ Saved index to {self.index_path}")
        return True
    
    def retrieve_relevant_documents(self, query: str, k: int = 5) -> List[Tuple[str, float]]:
        """
        Retrieve relevant documents for a query using FAISS.
        Ultra-fast retrieval with low latency.
        Uses retry logic for embedding the query.
        
        Args:
            query: User query
            k: Number of documents to retrieve
            
        Returns:
            List of (document_text, distance_score) tuples
        """
        if self.index is None:
            raise ValueError("Index not built. Call build_index() first.")
        
        # Get query embedding with retry logic
        query_embedding = self._get_embedding_with_retry(query, max_retries=3)
        query_embedding = np.array([query_embedding], dtype=np.float32)
        
        # Search in FAISS index
        distances, indices = self.index.search(query_embedding, k)
        
        results = []
        for idx, distance in zip(indices[0], distances[0]):
            if 0 <= idx < len(self.metadata):
                doc_text = self.metadata[idx]['text']
                # Convert L2 distance to similarity score (0-1)
                similarity = 1 / (1 + distance)
                results.append((doc_text, similarity))
        
        return results
    
    def generate_career_advice(self, query: str, use_rag: bool = True) -> Tuple[str, float, List[str]]:
        """
        Generate career advice using RAG.
        Combines retrieval-augmented generation with Gemini LLM.
        
        Args:
            query: User's career question
            use_rag: Whether to use retrieval (True) or direct LLM (False)
            
        Returns:
            Tuple of (response_text, latency_ms, source_documents)
        """
        start_time = time.time()
        
        source_docs = []
        context = ""
        
        if use_rag:
            # Retrieve relevant documents
            retrieval_start = time.time()
            relevant_docs = self.retrieve_relevant_documents(query, k=3)
            retrieval_time = (time.time() - retrieval_start) * 1000
            
            # Build context from retrieved documents
            context = "\n\n".join([f"[Reference {i+1}]\n{doc}" for i, (doc, _) in enumerate(relevant_docs)])
            source_docs = [doc for doc, _ in relevant_docs]
            
            print(f"Document retrieval took {retrieval_time:.2f}ms")
        
        # Generate response using Gemini
        generation_start = time.time()
        
        system_prompt = """You are an expert career advisor at Pathfinder AI. You have deep knowledge of career paths, 
salary expectations, skill requirements, and career transitions in India. Provide practical, actionable career advice 
based on the user's question. Be specific with salary ranges, timeline expectations, and actionable next steps."""
        
        if use_rag:
            user_message = f"""Based on these career knowledge references:

{context}

Please answer the following career question: {query}

Provide specific, actionable advice with concrete examples from the knowledge base. Mention relevant salary ranges and 
career paths where applicable."""
        else:
            user_message = query
        
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content([
                {"role": "user", "parts": [{"text": system_prompt + "\n\n" + user_message}]}
            ])
            
            advice = response.text
            generation_time = (time.time() - generation_start) * 1000
            total_time = (time.time() - start_time) * 1000
            
            print(f"Generation took {generation_time:.2f}ms | Total time: {total_time:.2f}ms")
            
            return advice, total_time, source_docs
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return f"Error: {str(e)}", 0, source_docs


# Global RAG instance for function tool usage
_rag_instance = None


def initialize_career_rag(knowledge_base_path: str = "career_knowledge_base.txt", 
                         force_rebuild: bool = False) -> CareerRAGSystem:
    """
    Initialize the career RAG system globally.
    
    Args:
        knowledge_base_path: Path to knowledge base
        force_rebuild: Force rebuild of FAISS index
        
    Returns:
        CareerRAGSystem instance
    """
    global _rag_instance
    
    print("Initializing Career RAG System...")
    _rag_instance = CareerRAGSystem(knowledge_base_path)
    _rag_instance.load_knowledge_base()
    _rag_instance.build_index(force_rebuild=force_rebuild)
    
    print("✓ Career RAG System initialized successfully!")
    return _rag_instance


def get_career_advice(query: str, use_rag: bool = True) -> dict:
    """
    Get career advice for a query using the RAG system.
    Function tool that can be integrated with LiveKit agents.
    
    Args:
        query: Career question from user
        use_rag: Use retrieval augmentation (default: True)
        
    Returns:
        Dictionary with advice, latency, and sources
    """
    global _rag_instance
    
    if _rag_instance is None:
        _rag_instance = initialize_career_rag()
    
    try:
        advice, latency_ms, sources = _rag_instance.generate_career_advice(query, use_rag=use_rag)
        
        return {
            "success": True,
            "advice": advice,
            "latency_ms": latency_ms,
            "sources": sources[:2],  # Return top 2 sources
            "query": query
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "query": query
        }


def batch_process_queries(queries: List[str]) -> List[dict]:
    """
    Process multiple queries in batch for efficiency.
    
    Args:
        queries: List of career questions
        
    Returns:
        List of results for each query
    """
    global _rag_instance
    
    if _rag_instance is None:
        _rag_instance = initialize_career_rag()
    
    results = []
    total_start = time.time()
    
    for i, query in enumerate(queries, 1):
        print(f"\nProcessing query {i}/{len(queries)}: {query[:60]}...")
        result = get_career_advice(query)
        results.append(result)
    
    total_time = (time.time() - total_start) * 1000
    print(f"\n✓ Batch processing completed in {total_time:.2f}ms for {len(queries)} queries")
    
    return results


# Test the RAG system
if __name__ == "__main__":
    # Initialize RAG system
    rag = initialize_career_rag()
    
    # Test queries
    test_queries = [
        "What are the best career paths for software engineers in India?",
        "I want to transition from banking to technology. What should I do?",
        "What's the salary expectation for a Data Scientist in India?",
        "How can I prepare for a management role?",
        "What remote work opportunities are available in India?"
    ]
    
    print("\n" + "="*80)
    print("CAREER RAG SYSTEM - TEST QUERIES")
    print("="*80)
    
    results = batch_process_queries(test_queries)
    
    # Print results
    for i, result in enumerate(results, 1):
        print(f"\n{'='*80}")
        print(f"Query {i}: {result['query']}")
        print(f"{'='*80}")
        
        if result['success']:
            print(f"Latency: {result['latency_ms']:.2f}ms")
            print(f"\nAdvice:\n{result['advice']}")
            if result['sources']:
                print(f"\nSources ({len(result['sources'])} documents):")
                for source in result['sources'][:1]:
                    print(f"- {source[:200]}...")
        else:
            print(f"Error: {result['error']}")
