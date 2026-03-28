"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { LiveCallbacks, Session } from "@google/genai";
import {
  startLiveSession,
  gracefulShutdown
} from "@/lib/gemini";
import { playAudio } from "@/lib/audioUtils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from 'next-themes';
import { AgentAudioVisualizerAura } from '@/components/agent-audio-visualizer-aura';
import { AgentState } from "@livekit/components-react/hooks";

const TIMEOUT: number = 240000;

const ConversationModul = () => {

  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [messages, setMessages] = useState<{ content: string; role: string }[]>(
    [],
  );
  const [aiSession, setAiSession] = useState<Session | undefined>(undefined);
  const [mediaStream, setMediaStream] = useState<MediaStream | undefined>(undefined);
  const [scriptProcessorNode, setScriptProcessorNode] = useState<ScriptProcessorNode | undefined>(undefined);

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setSeconds(0);
    }
  }, [seconds]);

  useEffect(() => {
    const fullName = user?.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : "There";

    const genAiCallback: LiveCallbacks = {
      onopen: () => {
        console.log("Connection established!");
        handleCallStart();
      },
      onclose: (event) => {
        if (event.code === 1000) {
          console.log("Normal shutdown accomplished.");
          handleCallEnd();
        } else {
          console.error("Abnormal closure:", event.reason);
          handleError(new Error(`Connection closed: ${event.reason}`));
        }
      },
      onerror: (error) => {
        console.error("Live API Error:", error);
        handleError(error.error);
      },
      onmessage: (message) => {
        if (message.serverContent?.modelTurn?.parts) {
          for (const part of message.serverContent.modelTurn.parts) {
            if (part.inlineData) {
              playAudio(part.inlineData.data);
            }
          }
        }
      },
    };

    async function fetchData() {
      const [session, stream, processor] = await startLiveSession(fullName, genAiCallback);
      setAiSession(session as Session);
      setMediaStream(stream as MediaStream);
      setScriptProcessorNode(processor as ScriptProcessorNode);
    }

    if (callActive) {
      fetchData();
    } else {
      gracefulShutdown(aiSession, mediaStream!, scriptProcessorNode!);
    }

  }, [callActive]);

  const { user } = useUser();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  const { systemTheme } = useTheme();
  const [state, setState] = useState<AgentState>("connecting");

  const handleCallStart = () => {
    console.log("Call started");
    setConnecting(false);
    setCallActive(true);
    setState("listening");
  };

  const handleCallEnd = () => {
    console.log("Call ended");
    setCallActive(false);
    setConnecting(false);
    setState("connecting");
  };

  const handleError = (error: Error) => {
    console.log("Error", error);
    setConnecting(false);
    setCallActive(false);
    setState("connecting");
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleCall = async () => {
    if (callActive) {
      setCallActive(false);
      handleCallStart();
      handleError(new Error("Call ended"));
      handleCallEnd();
    } else {
      try {
        setConnecting(true);
        setMessages([]);

        setTimeout(async () => { setCallActive(false); }, TIMEOUT);
        setSeconds(Math.floor(TIMEOUT / 1000));

        setConnecting(false);
        setCallActive(true);
      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden  pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono">
            <span>Create Your </span>
            <span className="text-primary">Learning Schedule</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Have a voice conversation with our AI assistant to create your
            personalized plan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* AI ASSISTANT CARD */}
          <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* AI IMAGE */}

              <h2 className="text-xl font-bold text-foreground">UnMute AI</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Learning assistant
              </p>

              {/* SPEAKING INDICATOR */}

              <AgentAudioVisualizerAura
                size="sm"
                color="#1FD5F9"
                colorShift={0.1}
                state={state}
                themeMode={systemTheme}
                className="aspect-square size-auto w-full"
              />

            </div>
          </Card>

          {/* USER CARD */}
          <Card
            className={`bg-card/90 backdrop-blur-sm border overflow-hidden relative`}
          >
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* User Image */}
              <div className="relative size-32 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user?.imageUrl}
                  alt="User"
                  className="size-full object-cover rounded-full"
                />
              </div>

              <h2 className="text-xl font-bold text-foreground">You</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {user
                  ? (user.firstName + " " + (user.lastName || "")).trim()
                  : "Guest"}
              </p>

              {/* User Ready Text */}
              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border`}
              >
                <div className={`w-2 h-2 rounded-full bg-muted`} />
                <span className="text-xs text-muted-foreground">Ready</span>
              </div>
            </div>
          </Card>
        </div>

        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-64 overflow-y-auto transition-all duration-300 scroll-smooth"
          >
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-muted-foreground mb-1">
                    {msg.role === "assistant" ? "CodeFlex AI" : "You"}:
                  </div>
                  <p className="text-foreground">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CALL CONTROLS */}
        <div className="w-full flex justify-center gap-4">
          <Button
            className={`w-40 text-xl rounded-3xl ${callActive
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-primary hover:bg-primary/90"
              } text-white relative`}
            onClick={toggleCall}
            disabled={connecting}
          >
            {connecting && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75"></span>
            )}

            <span>
              {callActive
                ? `End Call (${seconds})`
                : connecting
                  ? "Connecting..."
                  : "Start Call"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationModul;
