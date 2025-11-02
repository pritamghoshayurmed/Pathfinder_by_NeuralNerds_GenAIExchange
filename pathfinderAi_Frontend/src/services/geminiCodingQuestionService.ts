import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface CodeTemplate {
  language: string;
  code: string;
}

export interface CodingQuestion {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
  examples: {
    input: string;
    output: string;
    explanation: string;
  }[];
  constraints: string[];
  testCases: TestCase[];
  hiddenTestCases: TestCase[];
  templates: CodeTemplate[];
  timeComplexity: {
    bruteForce: string;
    optimal: string;
  };
  spaceComplexity: {
    bruteForce: string;
    optimal: string;
  };
  hints: string[];
  approaches: {
    name: string;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    recommended: boolean;
  }[];
}

/**
 * Generate dynamic coding questions based on role, company, and level
 */
export async function generateCodingQuestions(
  role: string,
  company: string,
  level: "Junior" | "Mid" | "Senior"
): Promise<CodingQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert technical interviewer at ${company}. Generate 2 coding interview questions for a ${level} ${role} position.

Requirements:
- Question 1: ${level === "Junior" ? "Easy" : level === "Mid" ? "Medium" : "Hard"} difficulty
- Question 2: ${level === "Junior" ? "Easy-Medium" : level === "Mid" ? "Medium-Hard" : "Hard"} difficulty
- Questions should be relevant to ${role} and ${company}'s tech stack
- Include realistic examples, constraints, and test cases
- Provide code templates for: JavaScript, Python, TypeScript, Java, C++

For each question, provide:
1. Title (concise, descriptive)
2. Difficulty level
3. Relevant tags (e.g., Array, Hash Table, Dynamic Programming)
4. Clear problem description
5. 2 detailed examples with input, output, and explanation
6. Constraints list
7. 3-5 visible test cases
8. 2-3 hidden test cases (for validation)
9. Code templates for each language with function signatures
10. Time/space complexity for brute force and optimal solutions
11. 2-3 progressive hints
12. 2-3 solution approaches with complexity analysis

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "title": "Problem Title",
    "difficulty": "Easy|Medium|Hard",
    "tags": ["tag1", "tag2"],
    "description": "Clear problem statement",
    "examples": [
      {
        "input": "input description",
        "output": "output description",
        "explanation": "why this output"
      }
    ],
    "constraints": ["constraint1", "constraint2"],
    "testCases": [
      {
        "input": "test input",
        "expectedOutput": "expected output",
        "explanation": "test case explanation"
      }
    ],
    "hiddenTestCases": [
      {
        "input": "hidden input",
        "expectedOutput": "hidden output"
      }
    ],
    "templates": [
      {
        "language": "javascript",
        "code": "function signature and starter code"
      },
      {
        "language": "python",
        "code": "function signature and starter code"
      },
      {
        "language": "typescript",
        "code": "function signature and starter code"
      },
      {
        "language": "java",
        "code": "function signature and starter code"
      },
      {
        "language": "cpp",
        "code": "function signature and starter code"
      }
    ],
    "timeComplexity": {
      "bruteForce": "O(n²)",
      "optimal": "O(n)"
    },
    "spaceComplexity": {
      "bruteForce": "O(1)",
      "optimal": "O(n)"
    },
    "hints": ["hint1", "hint2", "hint3"],
    "approaches": [
      {
        "name": "Brute Force",
        "description": "approach description",
        "timeComplexity": "O(n²)",
        "spaceComplexity": "O(1)",
        "recommended": false
      },
      {
        "name": "Optimal Solution",
        "description": "optimal approach",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(n)",
        "recommended": true
      }
    ]
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const questions: CodingQuestion[] = JSON.parse(jsonMatch[0]);
    
    // Validate and ensure we have exactly 2 questions
    if (!questions || questions.length < 2) {
      throw new Error("Failed to generate 2 questions");
    }

    return questions.slice(0, 2);
  } catch (error) {
    console.error("Error generating coding questions:", error);
    
    // Return fallback questions
    return getFallbackQuestions();
  }
}

/**
 * Fallback questions if API fails
 */
function getFallbackQuestions(): CodingQuestion[] {
  return [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      tags: ["Array", "Hash Table"],
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
          explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
        }
      ],
      constraints: [
        "2 ≤ nums.length ≤ 10⁴",
        "-10⁹ ≤ nums[i] ≤ 10⁹",
        "-10⁹ ≤ target ≤ 10⁹",
        "Only one valid answer exists"
      ],
      testCases: [
        {
          input: "[2,7,11,15], 9",
          expectedOutput: "[0,1]",
          explanation: "Basic test case"
        },
        {
          input: "[3,2,4], 6",
          expectedOutput: "[1,2]",
          explanation: "Numbers not in order"
        },
        {
          input: "[3,3], 6",
          expectedOutput: "[0,1]",
          explanation: "Duplicate numbers"
        }
      ],
      hiddenTestCases: [
        {
          input: "[-1,-2,-3,-4,-5], -8",
          expectedOutput: "[2,4]"
        },
        {
          input: "[1,2,3,4,5], 9",
          expectedOutput: "[3,4]"
        }
      ],
      templates: [
        {
          language: "javascript",
          code: "// Write your solution here\nfunction twoSum(nums, target) {\n  // Your code here\n}\n\nconsole.log(twoSum([2,7,11,15], 9));"
        },
        {
          language: "python",
          code: "# Write your solution here\ndef two_sum(nums, target):\n    # Your code here\n    pass\n\nprint(two_sum([2,7,11,15], 9))"
        },
        {
          language: "typescript",
          code: "// Write your solution here\nfunction twoSum(nums: number[], target: number): number[] {\n  // Your code here\n  return [];\n}\n\nconsole.log(twoSum([2,7,11,15], 9));"
        },
        {
          language: "java",
          code: "public class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n    \n    public static void main(String[] args) {\n        int[] result = twoSum(new int[]{2,7,11,15}, 9);\n        System.out.println(java.util.Arrays.toString(result));\n    }\n}"
        },
        {
          language: "cpp",
          code: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2,7,11,15};\n    vector<int> result = twoSum(nums, 9);\n    for(int i : result) cout << i << \" \";\n    return 0;\n}"
        }
      ],
      timeComplexity: {
        bruteForce: "O(n²)",
        optimal: "O(n)"
      },
      spaceComplexity: {
        bruteForce: "O(1)",
        optimal: "O(n)"
      },
      hints: [
        "Think about what you need to find for each number",
        "Can you store previously seen numbers somewhere?",
        "A hash map can help you find complements in O(1) time"
      ],
      approaches: [
        {
          name: "Brute Force",
          description: "Use nested loops to check all possible pairs of numbers",
          timeComplexity: "O(n²)",
          spaceComplexity: "O(1)",
          recommended: false
        },
        {
          name: "Hash Map",
          description: "Use a hash map to store seen numbers and their indices. For each number, check if its complement (target - number) exists in the map.",
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          recommended: true
        }
      ]
    },
    {
      id: 2,
      title: "Valid Parentheses",
      difficulty: "Easy",
      tags: ["String", "Stack"],
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: open brackets are closed by the same type of brackets, and open brackets are closed in the correct order.",
      examples: [
        {
          input: 's = "()"',
          output: "true",
          explanation: "The string contains valid parentheses that are properly closed."
        },
        {
          input: 's = "()[]{}"',
          output: "true",
          explanation: "All brackets are properly opened and closed in correct order."
        }
      ],
      constraints: [
        "1 ≤ s.length ≤ 10⁴",
        "s consists of parentheses only '()[]{}'."
      ],
      testCases: [
        {
          input: '"()"',
          expectedOutput: "true",
          explanation: "Simple valid case"
        },
        {
          input: '"()[]{}"',
          expectedOutput: "true",
          explanation: "Multiple bracket types"
        },
        {
          input: '"(]"',
          expectedOutput: "false",
          explanation: "Wrong closing bracket"
        }
      ],
      hiddenTestCases: [
        {
          input: '"{[]}"',
          expectedOutput: "true"
        },
        {
          input: '"([)]"',
          expectedOutput: "false"
        }
      ],
      templates: [
        {
          language: "javascript",
          code: "// Write your solution here\nfunction isValid(s) {\n  // Your code here\n}\n\nconsole.log(isValid('()'));"
        },
        {
          language: "python",
          code: "# Write your solution here\ndef is_valid(s):\n    # Your code here\n    pass\n\nprint(is_valid('()'))"
        },
        {
          language: "typescript",
          code: "// Write your solution here\nfunction isValid(s: string): boolean {\n  // Your code here\n  return false;\n}\n\nconsole.log(isValid('()'));"
        },
        {
          language: "java",
          code: "public class Solution {\n    public static boolean isValid(String s) {\n        // Your code here\n        return false;\n    }\n    \n    public static void main(String[] args) {\n        System.out.println(isValid(\"()\"));\n    }\n}"
        },
        {
          language: "cpp",
          code: "#include <iostream>\n#include <string>\nusing namespace std;\n\nbool isValid(string s) {\n    // Your code here\n    return false;\n}\n\nint main() {\n    cout << (isValid(\"()\") ? \"true\" : \"false\");\n    return 0;\n}"
        }
      ],
      timeComplexity: {
        bruteForce: "O(n²)",
        optimal: "O(n)"
      },
      spaceComplexity: {
        bruteForce: "O(n)",
        optimal: "O(n)"
      },
      hints: [
        "Think about Last In First Out (LIFO) data structure",
        "When you see an opening bracket, what should you expect next?",
        "A stack is perfect for matching pairs"
      ],
      approaches: [
        {
          name: "Stack",
          description: "Use a stack to keep track of opening brackets. When you encounter a closing bracket, check if it matches the most recent opening bracket (top of stack).",
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          recommended: true
        }
      ]
    }
  ];
}

export default {
  generateCodingQuestions,
  getFallbackQuestions
};
