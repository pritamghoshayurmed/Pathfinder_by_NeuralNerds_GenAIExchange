import { useEffect, useState } from "react";

export interface TranscriptionMessage {
  id: string;
  text: string;
  speaker: "user" | "agent";
  firstReceivedTime: number;
  isFinal: boolean;
  agentType?: string;  // "technical" or "behavioral"
  roomName?: string;   // The LiveKit room name
}

// Global transcription store to bridge between LiveKitWidget and TranscriptionDisplay
let globalTranscriptions: TranscriptionMessage[] = [];
let listeners: Set<() => void> = new Set();

export function setGlobalTranscriptions(messages: TranscriptionMessage[]) {
  globalTranscriptions = messages;
  listeners.forEach((listener) => listener());
}

export function useInterviewTranscriptions() {
  const [transcriptions, setTranscriptions] = useState<TranscriptionMessage[]>([]);

  useEffect(() => {
    // Set initial value
    setTranscriptions(globalTranscriptions);

    // Subscribe to updates
    const listener = () => {
      setTranscriptions([...globalTranscriptions]);
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return transcriptions;
}
