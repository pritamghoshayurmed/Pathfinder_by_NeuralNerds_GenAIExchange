import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_CHATBOT_API_KEY;

console.log('🔑 Environment Check:');
console.log('API Key from env:', API_KEY?.substring(0, 20) + '...' || 'NOT FOUND');

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const getChatbotResponse = async (message: string): Promise<string> => {
  console.log('🤖 getChatbotResponse called with:', message);
  
  if (!API_KEY || !genAI) {
    console.error('❌ No API key or genAI instance');
    return getIntelligentResponse(message);
  }

  const modelsToTry = ['gemini-2.5-flash'];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`🔄 Trying model: ${modelName}`);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });
      
      const prompt = `You are PathFinder AI, a career guidance assistant for Indian students. 

User message: "${message}"

Please provide a helpful, encouraging response about career guidance, education, or exam preparation. Keep it conversational and under 150 words.`;

      console.log(`🔄 Sending request to ${modelName}...`);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ Success with ${modelName}:`, text.substring(0, 100) + '...');
      
      if (text && text.trim().length > 0) {
        return text;
      }
      
    } catch (error) {
      console.error(`❌ ${modelName} failed:`, error);
      continue;
    }
  }
  
  console.log('🔄 All models failed, using intelligent fallback');
  return getIntelligentResponse(message);
};

const getIntelligentResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
    return `Great question about careers! 🚀 I'd love to help you explore career options. What specific career field interests you - technology, healthcare, business, or something else?`;
  }
  
  if (lowerMessage.includes('exam') || lowerMessage.includes('jee') || lowerMessage.includes('neet')) {
    return `Exam preparation is crucial! 📚 Are you preparing for JEE, NEET, CLAT, or another competitive exam? Our mock tests and study materials are available 24/7!`;
  }
  
  if (lowerMessage.includes('college') || lowerMessage.includes('admission')) {
    return `College selection is a big decision! 🎓 What course or field are you interested in pursuing? Engineering, Medicine, Commerce, or Arts?`;
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return `Hello! 👋 I'm PathFinder AI, your career guidance assistant. What would you like to know about careers, exams, or college admissions?`;
  }
  
  return `Thanks for your message: "${message}" 😊 I'm here to help with career guidance, exam preparation, and college admissions. Could you ask me something specific about your educational goals?`;
};

export const testGeminiConnection = async (): Promise<boolean> => {
  console.log('🧪 Testing Gemini connection...');
  
  if (!API_KEY || !genAI) {
    console.log('❌ No API key available');
    return false;
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Test message. Please respond with just 'Connection successful'");
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Connection test successful:', text);
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
};