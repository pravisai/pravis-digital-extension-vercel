
"use client"

import { useState, useEffect, useRef } from 'react';

// Check if the browser supports the Web Speech API
const isSpeechRecognitionSupported =
  typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

interface UseSpeechToTextOptions {
  onTranscriptReady?: (transcript: string) => void;
}

export const useSpeechToText = ({ onTranscriptReady }: UseSpeechToTextOptions = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      console.warn('Speech Recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onend = () => {
      setIsRecording(false);
      // Use a timeout to ensure the final transcript state is processed
      setTimeout(() => {
        setTranscript(prev => {
            if (prev.trim() && onTranscriptReady) {
                onTranscriptReady(prev.trim());
            }
            return prev;
        });
      }, 100);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // The "network" error is common and can happen if the service is temporarily unavailable.
      // We can choose to log it silently or handle it gracefully.
      if (event.error !== 'no-speech' && event.error !== 'aborted' && event.error !== 'network') {
        console.error('Speech recognition error:', event.error);
      }
      setIsRecording(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscriptReady]);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      try {
        setTranscript('');
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
         // This can happen if start() is called again before it has truly stopped, or if permissions are denied.
         if ((error as DOMException).name === 'InvalidStateError') {
            console.warn("Speech recognition is already active. Ignoring start command.");
         } else {
            console.error("Speech recognition could not be started: ", error);
         }
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return { isRecording, transcript, startRecording, stopRecording, isSpeechRecognitionSupported };
};
