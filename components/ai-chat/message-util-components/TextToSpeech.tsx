import React, { ReactNode, useEffect, useState } from 'react';
import { MdMic, MdMicOff } from 'react-icons/md';
import { useSpeech } from 'react-text-to-speech';
import './textToSpeech.scss';

interface TextToSpeechProps {
  children: ReactNode;
  rawText: string;
  autoplay: boolean;
}

export function TextToSpeech({
  children,
  rawText,
  autoplay,
}: TextToSpeechProps) {
  if (!rawText) return null;
  const [isTalking, setIsTalking] = useState(false);

  function stripMarkdownFormatting(input: string): string {
    return (
      input
        // Replace --- with pause text or silence
        .replace(/^---$/gm, `\n`)
        // Remove bold (**text**)
        .replace(/\*\*(.*?)\*\*/g, '$1')
        // Remove italic (*text* or _text_)
        .replace(/(\*|_)(.*?)\1/g, '$2')
        // Replace links [text](url) -> text
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
        // Remove Thinking...
        .replace(/^Thinking\.\.\.$/gm, '')
    );
  }
  const { Text, speechStatus, start, pause, stop } = useSpeech({
    text: stripMarkdownFormatting(rawText),
    pitch: 1,
    rate: 0.9,
    volume: 1,
    lang: '',
    voiceURI: 'Google UK English Female',
    autoPlay: autoplay,
    highlightText: false,
    showOnlyHighlightedText: false,
    highlightMode: 'word',
    enableDirectives: false,
  });

  useEffect(() => {
    setIsTalking(speechStatus === 'started');
  }, [speechStatus]);

  function handleStart() {
    start();
  }
  function handleStop() {
    start();
  }

  return (
    <div className="tts-wrapper">
      {children}

      <div className="tts-controls-wrapper">
        {!isTalking && (
          <button onClick={handleStart} className="tts-btn">
            <MdMic />
          </button>
        )}
        {isTalking && (
          <button onClick={handleStop} className="tts-btn">
            <MdMicOff />
          </button>
        )}
      </div>
    </div>
  );
}
