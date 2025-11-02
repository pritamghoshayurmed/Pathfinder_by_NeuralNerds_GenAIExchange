import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyCk09r1v2PfU6SE9CYzXHGrOglFEfAUwT8';
const genAI = new GoogleGenerativeAI(API_KEY);

async function testModels() {
  const modelsToTest = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-2.5-flash',
    'gemini-1.5-pro-latest'
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`\n🧪 Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello");
      const response = await result.response;
      const text = response.text();
      console.log(`✅ ${modelName} works:`, text.substring(0, 50) + '...');
    } catch (error) {
      console.log(`❌ ${modelName} failed:`, error.message);
    }
  }
}

testModels();