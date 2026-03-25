"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speak, stopSpeaking, isSpeechSynthesisSupported } from "@/lib/speech";

interface VoiceOutputProps {
  text: string;
  autoSpeak?: boolean;
}

export function VoiceOutput({ text, autoSpeak = false }: VoiceOutputProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isSpeechSynthesisSupported());
  }, []);

  useEffect(() => {
    if (autoSpeak && text && supported) {
      setIsSpeaking(true);
      speak(text, () => setIsSpeaking(false));
    }
  }, [text, autoSpeak, supported]);

  const toggle = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speak(text, () => setIsSpeaking(false));
    }
  };

  if (!supported) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="shrink-0 h-6 w-6"
      title={isSpeaking ? "Stop speaking" : "Read aloud"}
    >
      {isSpeaking ? (
        <VolumeX className="h-3 w-3" />
      ) : (
        <Volume2 className="h-3 w-3" />
      )}
    </Button>
  );
}
