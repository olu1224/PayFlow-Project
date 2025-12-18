
import React, { useState, useEffect, useRef } from 'react';
import { connectLiveAssistant } from '../geminiService';
import { User } from '../types';

const VoiceAssistant: React.FC<{ user: User; isOpen: boolean; onClose: () => void }> = ({ user, isOpen, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) int16[i] = data[i] * 32768;
    return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
  };

  useEffect(() => {
    if (isOpen && !sessionRef.current) {
      startSession();
    }
    return () => stopSession();
  }, [isOpen]);

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      // Fix: Passed user.country as required by connectLiveAssistant (Expected 2 arguments)
      const sessionPromise = connectLiveAssistant({
        onopen: () => {
          setIsActive(true);
          setIsConnecting(false);
          const source = audioContextRef.current!.createMediaStreamSource(stream);
          const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            sessionPromise.then((session: any) => session.sendRealtimeInput({ media: pcmBlob }));
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(audioContextRef.current!.destination);
        },
        onmessage: async (message: any) => {
          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
            const source = outputCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputCtx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
          }
        },
        onerror: (e: any) => console.error('Live error', e),
        onclose: () => setIsActive(false),
      }, user.country);
      sessionRef.current = sessionPromise;
    } catch (e) {
      console.error(e);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.then((s: any) => s.close());
      sessionRef.current = null;
    }
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setIsActive(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[3rem] p-12 text-center space-y-8 animate-in zoom-in-95 duration-300">
        <div className="relative">
           <div className={`w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto ${isActive ? 'animate-pulse' : ''}`}>
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.5"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
           </div>
           {isActive && (
             <div className="absolute inset-0 border-4 border-purple-500 rounded-full animate-ping opacity-20"></div>
           )}
        </div>
        
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            {isConnecting ? 'Initializing...' : isActive ? 'Listening...' : 'Voice Assistant'}
          </h2>
          <p className="text-slate-500 font-medium mt-2">Gemini 2.5 Native Audio</p>
        </div>

        <p className="text-sm text-slate-400 italic">"What is my current balance?" or "How much have I spent on data this month?"</p>

        <div className="flex justify-center gap-4">
           <button 
             onClick={onClose}
             className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
           >
             End Session
           </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
