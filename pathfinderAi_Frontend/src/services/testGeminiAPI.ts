import { GoogleGenerativeAI } from '@google/generative-ai';

// Test API function
export const testGeminiAPI = async () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY_NABIN;
  console.log('Testing Gemini API with key:', apiKey ? 'Available' : 'Missing');
  
  if (!apiKey) {
    console.error('No API key found');
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = "Generate a simple JSON object with a 'message' field containing 'Hello World'";
    
    console.log('Sending test request...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Test response:', text);
    return text;
  } catch (error) {
    console.error('Test API error:', error);
    throw error;
  }
};

// Call this function for testing
if (typeof window !== 'undefined') {
  (window as any).testGeminiAPI = testGeminiAPI;
}