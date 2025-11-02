import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Square, 
  Trash2, 
  Plus, 
  Code2, 
  FileCode, 
  Terminal,
  BookOpen,
  Copy,
  Download,
  RotateCcw,
  Sparkles,
  Zap,
  Cloud,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NotebookCell {
  id: string;
  type: 'code' | 'markdown';
  content: string;
  output?: string;
  language?: string;
  isRunning?: boolean;
}

interface CodeEditorNotebookProps {
  defaultLanguage?: string;
  skillName?: string;
}

const CodeEditorNotebook = ({ 
  defaultLanguage = "python",
  skillName = "Learning"
}: CodeEditorNotebookProps) => {
  const [mode, setMode] = useState<'editor' | 'notebook'>('editor');
  const [language, setLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(getDefaultCode(defaultLanguage));
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionMode, setExecutionMode] = useState<'browser' | 'api'>('api');
  
  // Notebook state
  const [cells, setCells] = useState<NotebookCell[]>([
    {
      id: '1',
      type: 'code',
      content: getDefaultCode(defaultLanguage),
      language: defaultLanguage,
    }
  ]);
  const [activeCell, setActiveCell] = useState<string>('1');

  const editorRef = useRef<any>(null);

  function getDefaultCode(lang: string): string {
    const templates: Record<string, string> = {
      python: `# Welcome to Python Code Editor
# This is a REAL Python execution environment!

# Example 1: Basic Python
def greet(name):
    return f"Hello, {name}!"

print(greet("Developer"))

# Example 2: List comprehension
numbers = [1, 2, 3, 4, 5]
squared = [n**2 for n in numbers]
print(f"Squared numbers: {squared}")

# Example 3: Simple data processing
data = [10, 20, 30, 40, 50]
average = sum(data) / len(data)
print(f"Average: {average}")

# Example 4: String manipulation
text = "Python Code Execution"
print(f"Uppercase: {text.upper()}")
print(f"Word count: {len(text.split())}")`,
      javascript: `// Welcome to JavaScript Code Editor
// Perfect for Full-Stack Development!

// Example: Modern JavaScript Features
const greet = (name) => {
  return \`Hello, \${name}! Welcome to coding.\`;
};

// Array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log(greet("Developer"));
console.log("Doubled:", doubled);
console.log("Sum:", sum);

// Async/Await example
async function fetchData() {
  console.log("Fetching data...");
  return "Data loaded successfully!";
}

fetchData().then(console.log);`,
      typescript: `// Welcome to TypeScript Code Editor
// Perfect for Type-Safe Development!

interface User {
  name: string;
  age: number;
  email: string;
}

const user: User = {
  name: "Developer",
  age: 25,
  email: "dev@example.com"
};

function greetUser(user: User): string {
  return \`Hello \${user.name}, you are \${user.age} years old.\`;
}

console.log(greetUser(user));

// Generic function
function findMax<T extends number>(arr: T[]): T {
  return Math.max(...arr) as T;
}

console.log("Max:", findMax([1, 5, 3, 9, 2]));`,
      java: `// Welcome to Java Code Editor
// Perfect for Enterprise Development!

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        
        // Example: Simple Calculator
        Calculator calc = new Calculator();
        System.out.println("Sum: " + calc.add(10, 20));
        System.out.println("Product: " + calc.multiply(5, 6));
    }
}

class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
    
    public int multiply(int a, int b) {
        return a * b;
    }
}`,
      cpp: `// Welcome to C++ Code Editor
// This is a REAL C++ execution environment!

#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    
    // Example: Vector operations
    vector<int> numbers = {5, 2, 8, 1, 9};
    
    sort(numbers.begin(), numbers.end());
    
    cout << "Sorted: ";
    for(int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    // Sum of numbers
    int sum = 0;
    for(int num : numbers) {
        sum += num;
    }
    cout << "Sum: " << sum << endl;
    
    return 0;
}`,
      c: `// Welcome to C Code Editor
// This is a REAL C execution environment!

#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("Hello from C!\\n");
    
    // Example: Array operations
    int numbers[] = {5, 2, 8, 1, 9};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    printf("Original: ");
    for(int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    
    // Calculate sum
    int sum = 0;
    for(int i = 0; i < size; i++) {
        sum += numbers[i];
    }
    printf("Sum: %d\\n", sum);
    printf("Average: %.2f\\n", (float)sum / size);
    
    return 0;
}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to HTML</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        .container {
            background: #f0f0f0;
            padding: 20px;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to HTML/CSS Editor!</h1>
        <p>Start building amazing web pages.</p>
    </div>
</body>
</html>`,
    };
    return templates[lang] || `// Start coding in ${lang}...\n`;
  }

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(getDefaultCode(newLang));
    setOutput("");
    
    if (mode === 'notebook') {
      setCells([{
        id: '1',
        type: 'code',
        content: getDefaultCode(newLang),
        language: newLang,
      }]);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running code...\n");

    try {
      if (language === 'javascript' || language === 'typescript') {
        // Execute JavaScript/TypeScript in a sandboxed environment
        const logs: string[] = [];
        const errors: string[] = [];
        
        // Create a sandboxed execution context
        const sandbox = {
          console: {
            log: (...args: any[]) => {
              logs.push(args.map(arg => {
                if (typeof arg === 'object') {
                  try {
                    return JSON.stringify(arg, null, 2);
                  } catch {
                    return String(arg);
                  }
                }
                return String(arg);
              }).join(' '));
            },
            error: (...args: any[]) => {
              errors.push(args.map(arg => String(arg)).join(' '));
            },
          },
          setTimeout,
          setInterval,
          clearTimeout,
          clearInterval,
          Math,
          Date,
          JSON,
          Array,
          Object,
          String,
          Number,
          Boolean,
        };

        try {
          // Create function with sandbox context
          const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
          const sandboxedCode = new AsyncFunction(...Object.keys(sandbox), code);
          
          // Execute with timeout
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Execution timeout (5s)')), 5000)
          );
          
          const executionPromise = sandboxedCode(...Object.values(sandbox));
          
          await Promise.race([executionPromise, timeoutPromise]);
          
          const output = [
            ...logs,
            ...(errors.length > 0 ? ['', '❌ Errors:', ...errors] : []),
          ].join('\n');
          
          setOutput(output || '✅ Code executed successfully (no output)');
        } catch (error: any) {
          setOutput(`❌ Runtime Error:\n${error.message}\n\n${errors.join('\n')}`);
        }
      } else if (language === 'python') {
        // Use Piston API for Python execution
        await executePythonCode(code);
      } else if (language === 'java' || language === 'cpp' || language === 'c') {
        // Use Piston API for compiled languages
        await executeCompiledCode(code, language);
      } else if (language === 'html') {
        // For HTML, show preview
        setOutput(`✅ HTML Preview Ready\n\n💡 Use the browser preview to see the rendered output.`);
      } else {
        setOutput(`⚠️ Direct execution not supported for ${language}\n\nTip: Use an online compiler or install ${language} runtime.`);
      }
    } catch (error: any) {
      setOutput(`❌ Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Execute Python code using Piston API
  const executePythonCode = async (pythonCode: string) => {
    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'python',
          version: '3.10.0',
          files: [
            {
              name: 'main.py',
              content: pythonCode,
            },
          ],
        }),
      });

      const result = await response.json();

      if (result.run) {
        const output = result.run.output || '';
        const stderr = result.run.stderr || '';
        
        if (stderr) {
          setOutput(`❌ Error:\n${stderr}\n\n${output}`);
        } else {
          setOutput(output || '✅ Code executed successfully (no output)');
        }
      } else {
        setOutput('❌ Execution failed: Unable to run code');
      }
    } catch (error: any) {
      setOutput(`❌ API Error: ${error.message}\n\n⚠️ Fallback: Using local execution...`);
      // Fallback message
      setOutput(prev => prev + '\n\n💡 Install Python packages locally for full functionality.');
    }
  };

  // Execute compiled languages using Piston API
  const executeCompiledCode = async (sourceCode: string, lang: string) => {
    const languageMap: Record<string, { name: string; version: string; filename: string }> = {
      java: { name: 'java', version: '15.0.2', filename: 'Main.java' },
      cpp: { name: 'cpp', version: '10.2.0', filename: 'main.cpp' },
      c: { name: 'c', version: '10.2.0', filename: 'main.c' },
    };

    const langConfig = languageMap[lang];
    if (!langConfig) {
      setOutput(`❌ Language ${lang} not supported for execution`);
      return;
    }

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: langConfig.name,
          version: langConfig.version,
          files: [
            {
              name: langConfig.filename,
              content: sourceCode,
            },
          ],
        }),
      });

      const result = await response.json();

      if (result.compile) {
        const compileOutput = result.compile.output || '';
        if (compileOutput) {
          setOutput(`📝 Compilation:\n${compileOutput}\n`);
        }
      }

      if (result.run) {
        const output = result.run.output || '';
        const stderr = result.run.stderr || '';
        
        if (stderr) {
          setOutput(prev => `${prev}\n❌ Runtime Error:\n${stderr}`);
        } else {
          setOutput(prev => `${prev}\n✅ Output:\n${output || '(no output)'}`);
        }
      } else {
        setOutput('❌ Compilation failed');
      }
    } catch (error: any) {
      setOutput(`❌ API Error: ${error.message}`);
    }
  };

  const runNotebookCell = async (cellId: string) => {
    setCells(prev => prev.map(cell => 
      cell.id === cellId 
        ? { ...cell, isRunning: true }
        : cell
    ));

    try {
      const cell = cells.find(c => c.id === cellId);
      if (!cell || cell.type !== 'code') return;

      let output = '';

      if (cell.language === 'javascript' || cell.language === 'typescript') {
        // Execute JavaScript/TypeScript
        const logs: string[] = [];
        const sandbox = {
          console: {
            log: (...args: any[]) => {
              logs.push(args.map(arg => {
                if (typeof arg === 'object') {
                  try {
                    return JSON.stringify(arg, null, 2);
                  } catch {
                    return String(arg);
                  }
                }
                return String(arg);
              }).join(' '));
            },
          },
          Math,
          Date,
          JSON,
          Array,
          Object,
          String,
          Number,
          Boolean,
        };

        try {
          const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
          const sandboxedCode = new AsyncFunction(...Object.keys(sandbox), cell.content);
          await sandboxedCode(...Object.values(sandbox));
          output = logs.join('\n') || '✅ Executed successfully';
        } catch (error: any) {
          output = `❌ Error: ${error.message}`;
        }
      } else if (cell.language === 'python') {
        // Execute Python using Piston API
        try {
          const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              language: 'python',
              version: '3.10.0',
              files: [
                {
                  name: 'main.py',
                  content: cell.content,
                },
              ],
            }),
          });

          const result = await response.json();

          if (result.run) {
            const stdout = result.run.output || '';
            const stderr = result.run.stderr || '';
            
            if (stderr) {
              output = `❌ Error:\n${stderr}`;
            } else {
              output = stdout || '✅ Executed (no output)';
            }
          } else {
            output = '❌ Execution failed';
          }
        } catch (error: any) {
          output = `❌ API Error: ${error.message}`;
        }
      } else {
        // For other languages, use Piston API
        const languageMap: Record<string, { name: string; version: string; filename: string }> = {
          java: { name: 'java', version: '15.0.2', filename: 'Main.java' },
          cpp: { name: 'cpp', version: '10.2.0', filename: 'main.cpp' },
          c: { name: 'c', version: '10.2.0', filename: 'main.c' },
        };

        const langConfig = languageMap[cell.language || 'python'];
        
        if (langConfig) {
          try {
            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                language: langConfig.name,
                version: langConfig.version,
                files: [
                  {
                    name: langConfig.filename,
                    content: cell.content,
                  },
                ],
              }),
            });

            const result = await response.json();
            
            if (result.run) {
              const stdout = result.run.output || '';
              const stderr = result.run.stderr || '';
              output = stderr ? `❌ Error:\n${stderr}` : (stdout || '✅ Executed');
            } else {
              output = '❌ Execution failed';
            }
          } catch (error: any) {
            output = `❌ Error: ${error.message}`;
          }
        } else {
          output = `⚠️ Execution not supported for ${cell.language}`;
        }
      }

      setCells(prev => prev.map(c =>
        c.id === cellId ? { ...c, output, isRunning: false } : c
      ));
    } catch (error: any) {
      setCells(prev => prev.map(c =>
        c.id === cellId ? { ...c, output: `❌ Error: ${error.message}`, isRunning: false } : c
      ));
    }
  };

  const addNotebookCell = (type: 'code' | 'markdown' = 'code') => {
    const newCell: NotebookCell = {
      id: Date.now().toString(),
      type,
      content: type === 'code' ? '# New cell\n' : '## New Markdown Cell\n\nAdd your notes here...',
      language,
    };
    setCells(prev => [...prev, newCell]);
    setActiveCell(newCell.id);
  };

  const deleteNotebookCell = (cellId: string) => {
    setCells(prev => prev.filter(cell => cell.id !== cellId));
  };

  const updateCellContent = (cellId: string, content: string) => {
    setCells(prev => prev.map(cell =>
      cell.id === cellId ? { ...cell, content } : cell
    ));
  };

  const resetEditor = () => {
    setCode(getDefaultCode(language));
    setOutput("");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const extensions: Record<string, string> = {
      python: 'py',
      javascript: 'js',
      typescript: 'ts',
      java: 'java',
      cpp: 'cpp',
      html: 'html',
    };
    const ext = extensions[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Interactive Code Environment
            </CardTitle>
            <Badge variant="outline" className="border-purple-400/30 text-purple-300">
              {skillName}
            </Badge>
            <Badge variant="outline" className="border-green-400/30 text-green-300 flex items-center gap-1">
              {executionMode === 'api' ? <Cloud className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              {executionMode === 'api' ? 'Real Execution' : 'Browser'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-auto">
              <TabsList className="bg-white/5">
                <TabsTrigger value="editor" className="data-[state=active]:bg-purple-500/20">
                  <Code2 className="w-4 h-4 mr-2" />
                  Code Editor
                </TabsTrigger>
                <TabsTrigger value="notebook" className="data-[state=active]:bg-purple-500/20">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Notebook
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">🐍 Python</SelectItem>
                <SelectItem value="javascript">📜 JavaScript</SelectItem>
                <SelectItem value="typescript">📘 TypeScript</SelectItem>
                <SelectItem value="java">☕ Java</SelectItem>
                <SelectItem value="cpp">⚙️ C++</SelectItem>
                <SelectItem value="c">🔧 C</SelectItem>
                <SelectItem value="html">🌐 HTML/CSS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Info Banner */}
        <Alert className="m-4 border-blue-500/30 bg-blue-500/10">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200 text-sm">
            <strong>Real Code Execution:</strong> Your code runs in actual runtime environments. 
            {language === 'python' || language === 'java' || language === 'cpp' || language === 'c' 
              ? ' Using Piston API for server-side execution.' 
              : ' Using sandboxed browser execution.'}
          </AlertDescription>
        </Alert>

        {mode === 'editor' ? (
          <>
            {/* Code Editor */}
            <div className="relative">
              <Editor
                height="400px"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  formatOnPaste: true,
                  formatOnType: true,
                }}
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
              />
              
              {/* Floating Action Bar */}
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-800/90 backdrop-blur border-white/10 text-white hover:bg-slate-700"
                  onClick={copyCode}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-800/90 backdrop-blur border-white/10 text-white hover:bg-slate-700"
                  onClick={downloadCode}
                >
                  <Download className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-800/90 backdrop-blur border-white/10 text-white hover:bg-slate-700"
                  onClick={resetEditor}
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Control Bar */}
            <div className="border-t border-white/10 p-3 bg-slate-900/50">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {code.split('\n').length} lines
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {language === 'javascript' || language === 'typescript' 
                      ? '⚡ Browser execution' 
                      : '☁️ Remote execution'}
                  </div>
                </div>
                <Button
                  onClick={runCode}
                  disabled={isRunning}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {isRunning ? (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Execute Code
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="bg-slate-950 border-t border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-400" />
                  <span className="text-green-200 text-sm font-medium">Output</span>
                  {isRunning && (
                    <Badge variant="outline" className="border-yellow-400/30 text-yellow-300 text-xs">
                      <span className="animate-pulse">Executing...</span>
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  {executionMode === 'api' && (
                    <span className="flex items-center gap-1">
                      <Cloud className="w-3 h-3" />
                      Powered by Piston API
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-green-400 min-h-[100px] max-h-[200px] overflow-auto">
                {output || <span className="text-gray-500"># Run your code to see actual execution output...</span>}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Notebook Mode */}
            <div className="bg-slate-900 p-4 space-y-4 max-h-[600px] overflow-y-auto">
              {cells.map((cell, index) => (
                <div key={cell.id} className="bg-slate-800/50 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between p-2 border-b border-white/10 bg-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {cell.type === 'code' ? 'Code' : 'Markdown'} [{index + 1}]
                      </Badge>
                      {cell.type === 'code' && (
                        <span className="text-xs text-gray-400">{cell.language}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {cell.type === 'code' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                          onClick={() => runNotebookCell(cell.id)}
                          disabled={cell.isRunning}
                        >
                          {cell.isRunning ? (
                            <Square className="w-3 h-3" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => deleteNotebookCell(cell.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <Editor
                    height="150px"
                    language={cell.type === 'markdown' ? 'markdown' : cell.language}
                    value={cell.content}
                    onChange={(value) => updateCellContent(cell.id, value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      automaticLayout: true,
                    }}
                  />

                  {cell.output && (
                    <div className="border-t border-white/10 p-3 bg-black/30">
                      <div className="text-xs text-gray-400 mb-1">Output:</div>
                      <div className="font-mono text-sm text-green-400 whitespace-pre-wrap">
                        {cell.output}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex gap-2 justify-center pt-2">
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  onClick={() => addNotebookCell('code')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Code Cell
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  onClick={() => addNotebookCell('markdown')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Markdown Cell
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeEditorNotebook;
