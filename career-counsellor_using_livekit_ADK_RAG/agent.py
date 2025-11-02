import os
from typing import Any
from dotenv import load_dotenv
from langchain_community.tools.google_jobs import GoogleJobsQueryRun
from langchain_community.utilities.google_jobs import GoogleJobsAPIWrapper

from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions,function_tool, RunContext
from livekit.plugins import noise_cancellation, silero,groq

# Import agents from adk_agents
from adk_agents import (
    open_positions_agent,
    interview_qa_agent,
    interview_tips_agent,
    career_advisor_agent
)

# Import RAG system for career advice
from career_rag import initialize_career_rag, get_career_advice

load_dotenv()

# Initialize RAG system on module load
try:
    _rag_system = initialize_career_rag()
    print("✓ Career RAG System loaded successfully!")
except Exception as e:
    print(f"Warning: RAG system initialization failed: {e}")


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""
# Persona 
You are an experienced Career Coach and Technical Interview Expert at Pathfinder AI, a comprehensive career development platform.

# Context
You are helping users navigate their career journey, from job searching to interview preparation to long-term career planning. You have access to specialized tools that can provide detailed job listings, interview questions and answers, preparation tips, and personalized career guidance.

# Capabilities
You can help users with:
- Finding relevant job opportunities based on their skills and interests
- Preparing for interviews with tailored questions and answers
- Getting practical tips for interview success
- Receiving personalized career guidance and path recommendations
- Getting evidence-based career advice from a comprehensive knowledge base using advanced RAG technology

# Task
1. Understand the user's career goals, current situation, and needs
2. Provide relevant information and guidance using your specialized tools when appropriate
3. Offer actionable advice and next steps for career development
4. Maintain an encouraging, professional, and supportive tone throughout the conversation

# When to Use Tools - SPECIFIC GUIDELINES
- Use JOB SEARCH tools (search_jobs, get_open_positions) when users ask about:
  * "Find jobs for [role]" or "Show me [role] positions"
  * "What jobs are available in [location/company]" 
  * "Job openings for [skill/field]"

- Use INTERVIEW PREPARATION tools (get_interview_questions_and_answers, get_interview_tips) when users ask about:
  * "Interview questions for [role]" or "Practice interview for [role]"
  * "How to prepare for [company] interview"
  * "Interview tips and tricks"

- Use RAG CAREER ADVICE tool (get_rag_career_advice) when users ask SPECIFIC questions about:
  * SALARY: "What's the salary for [role]?", "How much does [position] earn?", "Pay scale for [career]?" (e.g., "salary for software engineer", "data scientist pay")
  * CAREER PATHS: "What are the career paths for [role]?", "How to progress in [field]?", "Career ladder for [position]?" (e.g., "career path for product manager")
  * SKILLS: "What skills do I need for [role]?", "What should I learn to become [position]?", "Qualifications for [career]?" (e.g., "skills for ML engineer")
  * TRANSITIONS: "How to transition from [current] to [target]?", "Can I switch from [field1] to [field2]?" (e.g., "transition from finance to tech")
  * REMOTE WORK: "Remote work opportunities for [role]?", "Can I work remotely as [position]?", "Remote jobs in [field]?" (e.g., "remote work for developers")
  * WORK-LIFE BALANCE: "Is work-life balance good in [industry]?", "How stressful is [career]?", "Work culture in [field]?" (e.g., "work-life balance in tech")
  * LOCATION CAREERS: "Best cities for [career] in India?", "Where do [professionals] work?", "Tech hubs in India?" (e.g., "best cities for software engineers")
  * GOVERNMENT JOBS: "Government jobs in [field]?", "PSU careers for [role]?", "IAS/IPS/IFS requirements?" (e.g., "PSU jobs for engineers")
  * ENTREPRENEURSHIP: "How to start a [industry] business?", "Skills for startup founder?", "Startup challenges in [field]?" (e.g., "starting a tech startup")
  * SPECIFIC ROLES: Questions about Software Engineer, Data Scientist, Product Manager, Doctor, Teacher, etc.

- Use CAREER GUIDANCE tools (get_career_guidance) for:
  * Personalized career planning and long-term advice
  * When users share their current role and want general guidance
  * Conversational career coaching sessions

# IMPORTANT: Tool Selection Priority
1. If question contains specific career facts (salaries, paths, skills, transitions) → Use RAG tool
2. If question is about finding actual job openings → Use job search tools  
3. If question is about interview preparation → Use interview tools
4. If question is general career guidance → Use career guidance tools

# Guidelines
- Be conversational and natural in your speech
- Ask clarifying questions to better understand their situation and goals
- Provide specific, actionable advice rather than generic suggestions
- Focus on their strengths and help them build confidence
- Keep responses focused and relevant to their immediate needs
- If they seem overwhelmed, break down advice into manageable steps
- Always maintain a positive, encouraging tone
- Don't mention that you're using tools or accessing external resources

 SESSION INSTRUCTION--> Greet the user warmly and introduce yourself as their career coach and interview preparation expert.

Say something like: "Hello! I'm your Pathfinder AI Career Coach. I'm here to help you navigate your career journey, from finding the right opportunities to acing interviews and planning your professional growth. What brings you here today? Are you looking for job opportunities, preparing for interviews, or seeking career guidance?"

Keep it natural and conversational. Wait for their response before continuing.
"""
        )

    @function_tool()
    async def search_jobs(
        self,
        context: RunContext,
        query: str,
    ) -> str:
        """Search for jobs based on the query using Google Jobs API.
        
        Args:
            query: The job search query.
        """
        tool = GoogleJobsQueryRun(api_wrapper=GoogleJobsAPIWrapper())
        return tool.run(query)

    @function_tool()
    async def get_open_positions(
        self,
        context: RunContext,
        query: str,
    ) -> str:
        """Get open job positions based on the user query.
        Uses AI to research and list 5 open job positions with titles, companies, and locations.
        Output limited to 250 tokens max.
        
        Args:
            query: The job search query (e.g., 'Python developer', 'Data scientist in NYC').
        """
        # Use the agent's instruction to generate response
        instruction = f"""
You are a Job search assistant. Based on the user query: '{query}', do your research on web and
list 5 open job positions.

For each position include:
- Job Title
- Company
- Location

Output as a numbered list. Keep your response concise within 250 tokens.
"""
        return instruction

    @function_tool()
    async def get_interview_questions_and_answers(
        self,
        context: RunContext,
        query: str,
    ) -> str:
        """Get common interview questions and answers for the given query.
        Uses AI to create 5 interview Q&A pairs tailored to the job position.
        Output limited to 250 tokens max.
        
        Args:
            query: The job position or interview topic (e.g., 'Senior Software Engineer', 'DevOps').
        """
        instruction = f"""
You are an interview coach. For the given query '{query}',
create 5 common interview questions with strong sample answers.

Format:
Q: <question>
A: <answer>

Keep your response concise within 250 tokens.
"""
        return instruction

    @function_tool()
    async def get_interview_tips(
        self,
        context: RunContext,
        query: str,
    ) -> str:
        """Get interview preparation tips and tricks.
        Uses AI to provide practical tips for excelling in interviews, covering company research,
        technical preparation, behavioral strategies, and communication tips.
        Output limited to 250 tokens max.
        
        Args:
            query: The job position or interview focus area.
        """
        instruction = f"""
You are a career mentor. Provide practical tips & tricks to excel in interviews for '{query}'.

Cover:
- How to research the company
- What to prepare technically
- Behavioral interview strategies
- Body language & communication tips

Output as a bulleted list and keep within 250 tokens.
"""
        return instruction

    @function_tool()
    async def get_career_guidance(
        self,
        context: RunContext,
        current_role: str,
        years_of_experience: str,
        career_goals: str,
    ) -> str:
        """Get personalized career guidance from an AI Career Advisor.
        The advisor will understand your current career situation, ask clarifying questions,
        identify growth opportunities, and provide actionable career path recommendations.
        Output limited to 250 tokens max.
        
        Args:
            current_role: Your current job title/position and industry.
            years_of_experience: How many years you've been working.
            career_goals: Your short-term (1-2 years) and long-term (5+ years) career goals.
        """
        instruction = f"""
You are a professional Career Advisor. Help this user clarify and strengthen their career path.

User Profile:
- Current Role: {current_role}
- Years of Experience: {years_of_experience}
- Career Goals: {career_goals}

Your approach:
1. Understand their current career situation
2. Ask follow-up questions to identify growth opportunities, skill gaps, and learning needs
3. Provide clear, actionable guidance with recommended career paths, skills to develop, and next steps

Be conversational, empathetic, and specific. Ask one or two questions at a time.
Keep your response within 250 tokens.
"""
        return instruction

    @function_tool()
    async def get_rag_career_advice(
        self,
        context: RunContext,
        query: str,
    ) -> str:
        """Get evidence-based career advice using RAG (Retrieval-Augmented Generation).
        This tool provides specific, factual information about careers in India from a comprehensive knowledge base including:
        
        SALARY INFORMATION:
        - Software Engineer: 4-20 LPA (Junior to Senior)
        - Data Scientist: 6-25 LPA
        - Product Manager: 15-40 LPA
        - Backend Developer: 5-18 LPA
        - Frontend Developer: 4-15 LPA
        - Full Stack Developer: 6-22 LPA
        - ML Engineer: 8-30 LPA
        - DevOps Engineer: 7-20 LPA
        - Doctor/Surgeon: 8-50 LPA
        - Investment Banker: 12-100+ LPA
        
        CAREER PATHS & PROGRESSION:
        - Technology: Junior → Senior → Tech Lead → Manager → Director
        - Finance: Analyst → Associate → VP → Director → MD
        - Healthcare: Intern → Resident → Specialist → Consultant
        - Management: Associate → Manager → Senior Manager → Director
        
        SKILLS & QUALIFICATIONS:
        - Technical roles: Programming languages, frameworks, certifications
        - Management roles: Leadership, domain expertise, business acumen
        - Creative roles: Portfolio, tools proficiency, industry knowledge
        
        CAREER TRANSITIONS:
        - IT to Management: Add business skills, leadership experience
        - Finance to Tech: Learn programming, data analysis
        - Non-tech to Tech: Bootcamps, self-learning, certifications
        
        REMOTE WORK & WORK-LIFE BALANCE:
        - Tech roles: 70-90% remote work possible
        - Finance: 30-50% remote work
        - Healthcare: Limited remote options
        - Government jobs: Variable by department
        
        LOCATION-SPECIFIC CAREERS:
        - Bangalore: Tech, IT, Startups
        - Mumbai: Finance, Media, Entertainment
        - Delhi: Government, Consulting, Education
        - Hyderabad: IT, Pharma, Government
        - Pune: IT, Manufacturing, Education
        
        GOVERNMENT & PSU JOBS:
        - IAS/IPS/IFS: Civil services through UPSC
        - PSU Technical: Through GATE exams
        - Banking: Through IBPS/SBI exams
        - Defense: Through NDA/CDS exams
        
        ENTREPRENEURSHIP:
        - Tech startups: Product development, funding, scaling
        - Service businesses: Market research, operations, marketing
        - E-commerce: Platform selection, logistics, customer service

        Use this tool when users ask SPECIFIC questions about career facts, not general guidance.

        Args:
            query: Specific career question (e.g., "What salary does a data scientist earn?",
                   "What are career paths for software engineers?", "Skills needed for product manager?",
                   "How to transition from finance to tech?", "Remote work for developers?")

        Returns:
            Detailed, evidence-based career information with specific facts and figures.
        """
        try:
            result = get_career_advice(query, use_rag=True)
            
            if result['success']:
                # Format response with source information
                response = f"""{result['advice']}

---
Generated with RAG system (Latency: {result['latency_ms']:.0f}ms)
Sources: {len(result['sources'])} career knowledge documents referenced
"""
                return response
            else:
                return f"Error generating advice: {result.get('error', 'Unknown error')}"
                
        except Exception as e:
            return f"Error in RAG career advice tool: {str(e)}"

async def entrypoint(ctx: agents.JobContext):
    session = AgentSession(
        stt=groq.STT(model="whisper-large-v3",detect_language=True,),
        llm="openai/gpt-4.1-mini",
        tts="cartesia/sonic-3",
        vad=silero.VAD.load(),
       
    )

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(
            # For telephony applications, use `BVCTelephony` instead for best results
            noise_cancellation=noise_cancellation.BVC(), 
        ),
    )

    await session.generate_reply(
        instructions="Greet the user ,say you are a multilingual carrer advisor from pathfinder AI named Pritam and offer your assistance."
    )

if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint,agent_name="pathfinder"))
