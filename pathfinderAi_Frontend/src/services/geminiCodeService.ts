import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export interface CodeExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  analysis?: {
    codeQuality: number; // 0-100
    correctness: number; // 0-100
    efficiency: number; // 0-100
    bestPractices: number; // 0-100;
    overallScore: number; // 0-100
    strengths: string[];
    improvements: string[];
    feedback: string;
    bugs: string[];
    suggestions: string[];
    timeComplexity?: string;
    spaceComplexity?: string;
    optimalTimeComplexity?: string;
    optimalSpaceComplexity?: string;
    complexityAnalysis?: string;
  };
  executionTime?: string;
  syntaxErrors?: string[];
  testCaseResults?: {
    passed: number;
    total: number;
    details: {
      input: string;
      expectedOutput: string;
      actualOutput: string;
      passed: boolean;
    }[];
  };
}

/**
 * Analyzes and executes code using Gemini API
 * @param code - The code to analyze and execute
 * @param language - Programming language
 * @param problemDescription - Optional problem description for context
 * @param testCases - Optional test cases for validation
 * @param optimalComplexity - Optional optimal complexity for comparison
 */
export async function analyzeAndExecuteCode(
  code: string,
  language: string,
  problemDescription?: string,
  testCases?: { input: string; expectedOutput: string }[],
  optimalComplexity?: { time: string; space: string }
): Promise<CodeExecutionResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const testCasesSection = testCases && testCases.length > 0 
      ? `\n\nTest Cases to validate:
${testCases.map((tc, idx) => `Test ${idx + 1}: Input: ${tc.input}, Expected: ${tc.expectedOutput}`).join('\n')}`
      : '';

    const optimalComplexitySection = optimalComplexity
      ? `\n\nOptimal Solution Complexity:
- Time Complexity: ${optimalComplexity.time}
- Space Complexity: ${optimalComplexity.space}`
      : '';

    const prompt = `You are an expert coding interviewer and code analyzer. Analyze the following ${language} code and provide detailed feedback.

${problemDescription ? `Problem: ${problemDescription}\n\n` : ''}
Code to analyze:
\`\`\`${language}
${code}
\`\`\`
${testCasesSection}${optimalComplexitySection}

Please provide:
1. **Syntax Check**: Identify any syntax errors (return empty array if none)
2. **Code Execution**: Simulate the execution and provide the output (or explain what it would output)
3. **Time & Space Complexity Analysis**: 
   - Analyze the actual time complexity of this code
   - Analyze the actual space complexity of this code
   ${optimalComplexity ? `- Compare with optimal: ${optimalComplexity.time} time, ${optimalComplexity.space} space` : ''}
   - Provide brief explanation of complexity analysis
4. **Code Analysis**: Provide detailed analysis with scores (0-100) for:
   - Code Quality (readability, structure, naming)
   - Correctness (does it solve the problem correctly?)
   - Efficiency (time/space complexity)
   - Best Practices (follows language conventions)
5. **Strengths**: List 2-3 things done well
6. **Improvements**: List 2-3 areas for improvement
7. **Bugs**: List any bugs or logical errors (empty if none)
8. **Suggestions**: Specific actionable suggestions
9. **Feedback**: Overall constructive feedback (2-3 sentences)
${testCases && testCases.length > 0 ? '10. **Test Case Validation**: For each test case, provide the actual output your code would produce' : ''}

Return your response in the following JSON format:
{
  "syntaxErrors": ["error1", "error2"] or [],
  "output": "simulated execution output",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  ${optimalComplexity ? '"optimalTimeComplexity": "' + optimalComplexity.time + '",\n  "optimalSpaceComplexity": "' + optimalComplexity.space + '",\n  ' : ''}
  "complexityAnalysis": "brief explanation of the complexity",
  "codeQuality": 85,
  "correctness": 90,
  "efficiency": 75,
  "bestPractices": 80,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "bugs": ["bug1"] or [],
  "suggestions": ["suggestion1", "suggestion2"],
  "feedback": "overall feedback"${testCases && testCases.length > 0 ? ',\n  "testCaseResults": [\n    {"input": "test input", "expectedOutput": "expected", "actualOutput": "actual", "passed": true}\n  ]' : ''}
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Calculate overall score
    const overallScore = Math.round(
      (analysis.codeQuality + 
       analysis.correctness + 
       analysis.efficiency + 
       analysis.bestPractices) / 4
    );

    // Process test case results if present
    let testCaseResults;
    if (analysis.testCaseResults && testCases) {
      testCaseResults = {
        passed: analysis.testCaseResults.filter((tc: any) => tc.passed).length,
        total: analysis.testCaseResults.length,
        details: analysis.testCaseResults
      };
    }

    return {
      success: analysis.syntaxErrors.length === 0,
      output: analysis.output,
      error: analysis.syntaxErrors.length > 0 ? analysis.syntaxErrors.join("\n") : undefined,
      syntaxErrors: analysis.syntaxErrors,
      executionTime: "< 1s (simulated)",
      testCaseResults,
      analysis: {
        codeQuality: analysis.codeQuality,
        correctness: analysis.correctness,
        efficiency: analysis.efficiency,
        bestPractices: analysis.bestPractices,
        overallScore,
        strengths: analysis.strengths,
        improvements: analysis.improvements,
        feedback: analysis.feedback,
        bugs: analysis.bugs,
        suggestions: analysis.suggestions,
        timeComplexity: analysis.timeComplexity,
        spaceComplexity: analysis.spaceComplexity,
        optimalTimeComplexity: analysis.optimalTimeComplexity,
        optimalSpaceComplexity: analysis.optimalSpaceComplexity,
        complexityAnalysis: analysis.complexityAnalysis
      }
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      output: "",
      error: error instanceof Error ? error.message : "Failed to analyze code with Gemini API. Please check your API key.",
    };
  }
}

/**
 * Quick syntax check only (faster)
 */
export async function quickSyntaxCheck(
  code: string,
  language: string
): Promise<{ valid: boolean; errors: string[] }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Check if this ${language} code has any syntax errors. Return ONLY a JSON object with this format:
{
  "valid": true/false,
  "errors": ["error1", "error2"] or []
}

Code:
\`\`\`${language}
${code}
\`\`\``;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { valid: true, errors: [] };
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Syntax check error:", error);
    return { valid: true, errors: [] }; // Fail open
  }
}

/**
 * Get code improvement suggestions
 */
export async function getCodeSuggestions(
  code: string,
  language: string,
  specificIssue?: string
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Provide 3-5 specific, actionable suggestions to improve this ${language} code${specificIssue ? ` focusing on: ${specificIssue}` : ''}.

Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY a JSON array of suggestions:
["suggestion1", "suggestion2", "suggestion3"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return ["Consider adding comments", "Check edge cases", "Optimize time complexity"];
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error getting suggestions:", error);
    return ["Consider adding comments", "Check edge cases", "Optimize time complexity"];
  }
}

export default {
  analyzeAndExecuteCode,
  quickSyntaxCheck,
  getCodeSuggestions
};
