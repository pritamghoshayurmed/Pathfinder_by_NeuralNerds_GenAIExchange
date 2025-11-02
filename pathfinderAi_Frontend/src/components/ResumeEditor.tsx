import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Send, Save, X, RefreshCw } from 'lucide-react';
import { atsService } from '@/services/atsService';

interface ResumeEditorProps {
  resumeText: string;
  onResumeUpdate: (text: string) => void;
  suggestions: any[];
}

export const ResumeEditor = ({ resumeText, onResumeUpdate, suggestions }: ResumeEditorProps) => {
  const [editedResume, setEditedResume] = useState(resumeText);
  const [isRefining, setIsRefining] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleApplySuggestion = (suggestion: any) => {
    const { originalText, suggestedText } = suggestion;
    const updated = editedResume.replace(originalText, suggestedText);
    setEditedResume(updated);
    onResumeUpdate(updated);
  };

  const handleRefineSection = async (sectionType: string) => {
    setIsRefining(true);
    try {
      const sectionRegex = new RegExp(`(${sectionType}.*?)(?=\\n\\n|$)`, 'is');
      const match = editedResume.match(sectionRegex);
      const sectionText = match ? match[0] : '';

      if (sectionText) {
        const refined = await atsService.refineResumeSection(sectionText, sectionType, editedResume);
        const updated = editedResume.replace(sectionText, refined);
        setEditedResume(updated);
        onResumeUpdate(updated);
      }
    } catch (error) {
      console.error('Error refining section:', error);
    } finally {
      setIsRefining(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setUserInput('');
    setIsLoading(true);

    try {
      const aiResponse = await atsService.getResumeChat(editedResume, userMessage);
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error('Error:', error);
      setChatMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResumeAsPDF = async () => {
    try {
      // Dynamically import jsPDF
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.jsPDF;

      // Create a simple text-based PDF without html2canvas
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const lineHeight = 7;
      let yPosition = margin;

      // Set font
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);

      // Split text into lines
      const lines = doc.splitTextToSize(editedResume, pageWidth - (margin * 2));

      // Add text to PDF
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if we need a new page
        if (yPosition + lineHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }

        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      }

      // Save the PDF
      doc.save('resume.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Downloading as text instead.');
      saveToLocal();
    }
  };

  const saveToLocal = () => {
    const element = document.createElement('a');
    const file = new Blob([editedResume], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'resume.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Editor */}
      <div className="lg:col-span-2 space-y-4">
        {/* Tabs/Sections */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="flex flex-wrap gap-2 p-4 border-b border-slate-700/50 bg-slate-900/50">
            {['Contact', 'Summary', 'Experience', 'Education', 'Skills'].map(section => (
              <button
                key={section}
                onClick={() => handleRefineSection(section)}
                disabled={isRefining}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-blue-500/20 disabled:opacity-50 text-slate-300 hover:text-blue-300"
              >
                <RefreshCw className={`w-3 h-3 inline mr-2 ${isRefining ? 'animate-spin' : ''}`} />
                Refine {section}
              </button>
            ))}
          </div>

          {/* Editor Content */}
          <div className="p-6">
            <textarea
              value={editedResume}
              onChange={(e) => {
                setEditedResume(e.target.value);
                onResumeUpdate(e.target.value);
              }}
              className="w-full h-96 bg-slate-950/50 border border-slate-700/50 rounded-lg p-4 text-slate-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your resume content will appear here..."
            />
          </div>

          {/* Editor Actions */}
          <div className="flex gap-3 p-4 border-t border-slate-700/50 bg-slate-900/30 flex-wrap">
            <Button
              onClick={() => downloadResumeAsPDF()}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button
              onClick={saveToLocal}
              variant="outline"
              className="border-blue-500/60 text-blue-300 hover:bg-blue-500/20"
            >
              <Save className="w-4 h-4 mr-2" />
              Save as TXT
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - Suggestions & Chat */}
      <div className="space-y-4">
        {/* Suggestions Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-4 max-h-96 overflow-y-auto">
          <h3 className="font-bold text-white mb-4">AI Suggestions</h3>
          <div className="space-y-3">
            {suggestions.slice(0, 3).map((suggestion, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedSuggestion(selectedSuggestion === idx ? null : idx)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 border ${
                  selectedSuggestion === idx
                    ? 'bg-blue-500/20 border-blue-500/40'
                    : 'bg-slate-700/30 border-slate-600/40 hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className="text-xs bg-gradient-to-r from-amber-500/40 to-orange-500/30">
                    {suggestion.priority}
                  </Badge>
                  <span className="text-xs text-slate-400">{suggestion.type}</span>
                </div>
                <p className="text-sm text-slate-300 line-clamp-2">{suggestion.reason}</p>
                {selectedSuggestion === idx && (
                  <div className="mt-3 space-y-2 pt-3 border-t border-slate-600/30">
                    <p className="text-xs text-slate-400">Original:</p>
                    <p className="text-xs text-slate-300 line-clamp-2">{suggestion.originalText}</p>
                    <p className="text-xs text-slate-400 mt-2">Suggested:</p>
                    <p className="text-xs text-emerald-300 line-clamp-2">{suggestion.suggestedText}</p>
                    <Button
                      onClick={() => handleApplySuggestion(suggestion)}
                      size="sm"
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 h-8"
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-4 flex flex-col h-80">
          <h3 className="font-bold text-white mb-3">Resume Coach</h3>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-3">
            {chatMessages.length === 0 && (
              <div className="text-center text-slate-400 text-sm py-4">
                Ask me anything about your resume...
              </div>
            )}
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm p-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500/20 text-blue-100 ml-4'
                    : 'bg-slate-700/30 text-slate-200 mr-4'
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me..."
              disabled={isLoading}
              className="flex-1 bg-slate-950/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !userInput.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 h-10"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
