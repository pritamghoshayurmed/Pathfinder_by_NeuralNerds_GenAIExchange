import { useInterviewTranscriptions, type TranscriptionMessage } from "@/hooks/useTranscriptions";
import { Bot, User } from "lucide-react";

interface TranscriptionDisplayProps {
  className?: string;
}

export function TranscriptionDisplay({ className = "" }: TranscriptionDisplayProps) {
  const transcriptions = useInterviewTranscriptions();

  return (
    <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${className}`}>
      {transcriptions.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p className="text-sm">Waiting for transcriptions...</p>
        </div>
      ) : (
        transcriptions.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.speaker === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${message.speaker === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.speaker === "user"
                    ? "bg-gradient-to-r from-accent to-primary"
                    : message.agentType === "behavioral"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-primary to-accent"
                }`}
              >
                {message.speaker === "user" ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message bubble */}
              <div
                className={`rounded-2xl p-4 ${
                  message.speaker === "user"
                    ? "bg-gradient-to-r from-accent to-primary text-white"
                    : "bg-muted/50 border border-border"
                } ${!message.isFinal ? "opacity-70" : ""}`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                {!message.isFinal && <span className="text-xs opacity-75 italic">Speaking...</span>}
                {/* Show agent type if available for debugging */}
                {message.agentType && message.speaker === "agent" && (
                  <div className="text-xs opacity-50 mt-2 border-t border-current pt-2">
                    {message.agentType === "behavioral" ? "🎯 Behavioral Agent" : "💻 Technical Agent"}
                    {message.roomName && ` • Room: ${message.roomName}`}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
