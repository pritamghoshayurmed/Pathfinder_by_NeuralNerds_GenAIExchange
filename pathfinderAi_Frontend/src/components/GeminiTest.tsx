import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import geminiService from '@/services/geminiService';

const GeminiTest: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);

  const testAPIConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Test with a simple quiz generation
      const quiz = await geminiService.generateQuiz('Software Developer', 'beginner');
      setTestResult({
        success: true,
        message: 'API connection successful!',
        data: {
          title: quiz.title,
          questionCount: quiz.questions.length,
          totalPoints: quiz.totalPoints
        }
      });
    } catch (error) {
      console.error('API Test Error:', error);
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        data: error
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gemini API Connection Test</CardTitle>
        <CardDescription>
          Test the connection to Google's Gemini API to ensure your API key is working correctly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={testAPIConnection}
            disabled={isTesting}
            className="flex-1"
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing Connection...
              </>
            ) : (
              'Test API Connection'
            )}
          </Button>
        </div>

        {testResult && (
          <Alert className={testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <AlertDescription className="font-medium">
                {testResult.success ? 'Success' : 'Error'}
              </AlertDescription>
            </div>
            <AlertDescription className="mt-2">
              {testResult.message}
            </AlertDescription>
            {testResult.data && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium">
                  View Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </details>
            )}
          </Alert>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Troubleshooting Tips:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Ensure your API key is correctly set in the .env file</li>
            <li>Verify the API key has the correct permissions for Gemini API</li>
            <li>Check that your API key hasn't expired</li>
            <li>Make sure you're using a valid Google AI API key (starts with 'AIza')</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeminiTest;