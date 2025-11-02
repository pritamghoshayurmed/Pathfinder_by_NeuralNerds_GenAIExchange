import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getChatbotResponse, testGeminiConnection } from "@/services/geminiChatService";

const DebugGemini = () => {
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    try {
      // Test connection
      const isConnected = await testGeminiConnection();
      console.log("Connection test:", isConnected);
      
      // Test actual response
      const response = await getChatbotResponse("Hello, can you help me with career guidance?");
      setTestResult(`Connection: ${isConnected ? 'Success' : 'Failed'}\nResponse: ${response}`);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg m-4">
      <h3 className="font-bold mb-2">Gemini API Debug</h3>
      <Button onClick={handleTest} disabled={isLoading}>
        {isLoading ? "Testing..." : "Test Gemini API"}
      </Button>
      {testResult && (
        <pre className="mt-4 p-2 bg-gray-100 rounded text-sm whitespace-pre-wrap">
          {testResult}
        </pre>
      )}
    </div>
  );
};

export default DebugGemini;