import React, { useEffect, useRef, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Copy, RefreshCw } from "lucide-react";
import { validateLatexCode, getLatexCompletions, getLatexLanguageConfig } from "@/services/latexCompilerService";

interface LatexEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCompile?: (latexCode: string) => Promise<void>;
  onValidate?: (isValid: boolean, errors: string[]) => void;
  isCompiling?: boolean;
  disabled?: boolean;
  height?: string;
}

const LatexEditor: React.FC<LatexEditorProps> = ({
  value,
  onChange,
  onCompile,
  onValidate,
  isCompiling = false,
  disabled = false,
  height = "600px",
}) => {
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Setup LaTeX language support in Monaco
  useEffect(() => {
    if (monaco) {
      // Define LaTeX language
      monaco.languages.register({ id: "latex" });

      // Set monarch tokenizer for LaTeX
      monaco.languages.setMonarchTokensProvider("latex", {
        tokenizer: {
          root: [
            [/\\[a-zA-Z]+/, "keyword"],
            [/%.*/, "comment"],
            [/[{}]/, "bracket"],
            [/[0-9]+/, "number"],
            [/./, "text"],
          ],
        },
      });

      // Set language configuration
      const langConfig = getLatexLanguageConfig();
      monaco.languages.setLanguageConfiguration("latex", {
        comments: langConfig.comments,
        brackets: langConfig.brackets as any,
        autoClosingPairs: langConfig.autoClosingPairs,
        surroundingPairs: langConfig.surroundingPairs,
      });

      // Register completion provider
      monaco.languages.registerCompletionItemProvider("latex", {
        provideCompletionItems: (model: any, position: any) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          return {
            suggestions: getLatexCompletions().map((comp: any) => ({
              label: comp.label,
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: comp.insertText,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
              documentation: `LaTeX command: ${comp.label}`,
              sortText: comp.label,
            })),
          };
        },
        triggerCharacters: ["\\"],
      });
    }
  }, [monaco]);

  // Validate LaTeX code
  useEffect(() => {
    const { isValid, errors: validationErrors } = validateLatexCode(value);
    setErrors(validationErrors);
    onValidate?.(isValid, validationErrors);
  }, [value, onValidate]);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-400">LaTeX Editor</span>
          {errors.length === 0 ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded text-xs text-emerald-300 border border-emerald-400/40">
              <Check className="w-3 h-3" />
              Valid
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded text-xs text-red-300 border border-red-400/40">
              <AlertCircle className="w-3 h-3" />
              {errors.length} error{errors.length > 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleFormatCode}
            disabled={disabled}
            className="border-slate-600 text-slate-300 hover:bg-slate-700/50 text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Format
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyCode}
            disabled={disabled}
            className="border-slate-600 text-slate-300 hover:bg-slate-700/50 text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          {onCompile && (
            <Button
              size="sm"
              onClick={() => onCompile(value)}
              disabled={disabled || isCompiling || errors.length > 0}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 text-xs"
            >
              {isCompiling ? "Compiling..." : "Compile to PDF"}
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
        <Editor
          height={height}
          language="latex"
          value={value}
          onChange={(newValue) => onChange(newValue || "")}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            suggestOnTriggerCharacters: true,
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
            tabSize: 2,
            insertSpaces: true,
            useTabStops: true,
          }}
          loading={
            <div className="flex items-center justify-center h-full bg-slate-900">
              <span className="text-slate-400">Loading editor...</span>
            </div>
          }
        />
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-300">Validation Errors</span>
          </div>
          <ul className="space-y-1 ml-6">
            {errors.map((error, idx) => (
              <li key={idx} className="text-xs text-red-300 list-disc">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Character Count */}
      <div className="text-xs text-slate-500">
        Characters: {value.length} | Lines: {value.split("\n").length}
      </div>
    </div>
  );
};

export default LatexEditor;
