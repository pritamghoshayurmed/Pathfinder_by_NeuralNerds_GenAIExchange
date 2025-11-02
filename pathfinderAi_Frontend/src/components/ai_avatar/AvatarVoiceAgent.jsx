import {
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  useTrackTranscription,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import { useTracks, VideoTrack } from '@livekit/components-react';
import { setGlobalTranscriptions } from "@/hooks/useTranscriptions";
import "./AvatarVoiceAgent.css";

const Message = ({ type, text }) => {
  return <div className="message">
    <strong className={`message-${type}`}>
      {type === "agent" ? "Agent: " : "You: "}
    </strong>
    <span className="message-text">{text}</span>
  </div>;
};

/**
 * AvatarVoiceAgent Component
 * Receives agentType and roomName to properly tag transcriptions
 */
const AvatarVoiceAgent = ({ agentType = "technical", roomName = "" }) => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });
  const trackRefs = useTracks([Track.Source.Camera]);
  const localCamTrackRef = trackRefs.find((trackRef) => trackRef.participant.name = 'admin');

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const agentMessages = (agentTranscriptions || []).map((t, idx) => ({
      id: `agent-${t.firstReceivedTime}-${idx}`,
      text: t.text || "",
      speaker: "agent",
      firstReceivedTime: t.firstReceivedTime || Date.now(),
      isFinal: t.isFinal ?? false,
      agentType: agentType,
      roomName: roomName,
    }));

    const userMessages = (userTranscriptions || []).map((t, idx) => ({
      id: `user-${t.firstReceivedTime}-${idx}`,
      text: t.text || "",
      speaker: "user",
      firstReceivedTime: t.firstReceivedTime || Date.now(),
      isFinal: t.isFinal ?? false,
      agentType: agentType,
      roomName: roomName,
    }));

    const allMessages = [...agentMessages, ...userMessages].sort(
      (a, b) => a.firstReceivedTime - b.firstReceivedTime
    );
    
    setMessages(allMessages);
    
    // Update global transcriptions for the display component
    setGlobalTranscriptions(allMessages);
  }, [agentTranscriptions, userTranscriptions, agentType, roomName]);

  return (
    <div className="voice-assistant-container">
      <div className="visualizer-container">
        <BarVisualizer state={state} barCount={5} trackRef={audioTrack} />
      </div>
      <>
      {localCamTrackRef ? <VideoTrack trackRef={localCamTrackRef} /> : <div>Calling the Concierce...</div>}
      </>
      <div className="control-section">
        <VoiceAssistantControlBar />
      </div>
    </div>
  );
};

export default AvatarVoiceAgent;
