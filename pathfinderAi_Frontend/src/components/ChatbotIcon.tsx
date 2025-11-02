import { useState, useEffect } from "react";
import { X, Send, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getChatbotResponse } from "@/services/geminiChatService";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

const ChatbotIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your PathFinder AI assistant. How can I help you with your career and educational journey today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleOpen = () => {
    setIsAnimating(true);
    setShowCard(true);
    setTimeout(() => {
      setIsOpen(true);
    }, 50);
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setIsOpen(false);
    setTimeout(() => {
      setShowCard(false);
      setIsAnimating(false);
    }, 500);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, typingMessage]);

    try {
      // Get AI response
      const aiResponse = await getChatbotResponse(inputMessage);
      
      // Remove typing indicator and add real response
      setMessages(prev => {
        const newMessages = prev.filter(msg => !msg.isLoading);
        return [...newMessages, {
          id: (Date.now() + 2).toString(),
          text: aiResponse,
          sender: 'bot',
          timestamp: new Date()
        }];
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Remove typing indicator and add error message
      setMessages(prev => {
        const newMessages = prev.filter(msg => !msg.isLoading);
        return [...newMessages, {
          id: (Date.now() + 2).toString(),
          text: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment!',
          sender: 'bot',
          timestamp: new Date()
        }];
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Button with Custom Robot Image */}
        <button
          onClick={isOpen ? handleClose : handleOpen}
          className={`relative h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 p-1 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${
            isAnimating ? 'animate-pulse' : ''
          } ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        >
          {/* Inner circle with robot image */}
          <div className="h-full w-full rounded-full bg-white p-1 flex items-center justify-center overflow-hidden">
            <img 
              src="/chatbot-robot.png" 
              alt="PathFinder AI Assistant" 
              className="h-12 w-12 object-contain transition-transform duration-300 hover:scale-110"
              onError={(e) => {
                // Fallback to Bot icon if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback Bot icon */}
            <Bot className="h-8 w-8 text-primary hidden" />
          </div>
          
          {/* Floating animation dots */}
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full"></div>
        </button>

        {/* Chat Card - Emerges from button */}
        {showCard && (
          <div
            className={`absolute bottom-0 right-0 transition-all duration-500 ease-out transform ${
              isOpen
                ? 'scale-100 opacity-100 translate-y-0 translate-x-0'
                : 'scale-0 opacity-0 translate-y-6 translate-x-6'
            }`}
            style={{
              transformOrigin: 'bottom right',
              marginBottom: '5rem',
              marginRight: '0',
            }}
          >
            <Card className="w-80 h-[500px] shadow-2xl border-2 border-primary/20 flex flex-col overflow-hidden bg-background">
              {/* Header with Robot Avatar */}
              <CardHeader 
                className={`bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-white rounded-t-lg py-3 px-4 flex-shrink-0 transition-all duration-500 delay-200 ${
                  isOpen 
                    ? 'translate-y-0 opacity-100' 
                    : '-translate-y-4 opacity-0'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Robot avatar in header */}
                    <div className="h-8 w-8 rounded-full bg-white p-1 flex items-center justify-center">
                      <img 
                        src="/chatbot-robot.png" 
                        alt="AI Assistant" 
                        className={`h-6 w-6 object-contain transition-all duration-500 delay-300 ${
                          isOpen ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
                        }`}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <Bot className={`h-4 w-4 text-primary hidden transition-all duration-500 delay-300 ${
                        isOpen ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
                      }`} />
                    </div>
                    <div className="flex flex-col">
                      <CardTitle className={`text-sm transition-all duration-500 delay-400 ${
                        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                      }`}>
                        PathFinder AI Assistant
                      </CardTitle>
                      {isTyping && (
                        <span className="text-xs opacity-75 animate-pulse">
                          AI is typing...
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleClose}
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 text-white hover:bg-white/20 transition-all duration-300 hover:rotate-90 ${
                      isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}
                    style={{ transitionDelay: '500ms' }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Content Area */}
              <CardContent 
                className={`flex flex-col flex-1 p-0 overflow-hidden transition-all duration-500 delay-300 ${
                  isOpen 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-4 opacity-0'
                }`}
              >
                {/* Messages Area */}
                <ScrollArea className="flex-1 px-4 py-3">
                  <div className="space-y-3">
                    {messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} transition-all duration-400 ${
                          isOpen 
                            ? 'translate-x-0 opacity-100 scale-100' 
                            : message.sender === 'user' 
                            ? 'translate-x-8 opacity-0 scale-95' 
                            : '-translate-x-8 opacity-0 scale-95'
                        }`}
                        style={{ 
                          transitionDelay: `${400 + (index * 100)}ms` 
                        }}
                      >
                        <div className="flex items-start space-x-2 max-w-[80%]">
                          {/* Bot avatar for bot messages */}
                          {message.sender === 'bot' && (
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-0.5 flex-shrink-0 mt-2">
                              <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                                {message.isLoading ? (
                                  <Loader2 className="h-3 w-3 text-primary animate-spin" />
                                ) : (
                                  <>
                                    <img 
                                      src="/chatbot-robot.png" 
                                      alt="AI" 
                                      className="h-4 w-4 object-contain"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                      }}
                                    />
                                    <Bot className="h-3 w-3 text-primary hidden" />
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div
                            className={`p-3 rounded-lg text-sm transform transition-all duration-300 hover:scale-105 ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none ml-auto'
                                : message.isLoading
                                ? 'bg-muted text-foreground rounded-bl-none animate-pulse'
                                : 'bg-muted text-foreground rounded-bl-none'
                            }`}
                          >
                            {message.isLoading ? (
                              <div className="flex items-center space-x-1">
                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            ) : (
                              message.text
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div 
                  className={`border-t bg-background p-4 flex-shrink-0 transition-all duration-500 delay-500 ${
                    isOpen 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-4 opacity-0'
                  }`}
                >
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={isTyping ? "AI is thinking..." : "Type your message..."}
                      className="flex-1 text-sm transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      className="shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 active:scale-95"
                      disabled={!inputMessage.trim() || isTyping}
                    >
                      {isTyping ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className={`h-4 w-4 transition-all duration-300 ${
                          inputMessage.trim() ? 'translate-x-0 rotate-0' : 'translate-x-1 rotate-12'
                        }`} />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Backdrop for mobile */}
      {(isOpen || isAnimating) && (
        <div 
          className={`fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        />
      )}
    </>
  );
};

export default ChatbotIcon;