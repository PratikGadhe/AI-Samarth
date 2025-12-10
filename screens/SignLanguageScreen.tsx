import React, { useRef, useState } from 'react';
import CameraView, { CameraViewHandle } from '../components/CameraView';
import Button from '../components/Button';
import { analyzeImage, generateSpeech } from '../services/geminiService';
import { playAudioContent } from '../utils/audioUtils';

interface Props {
  onBack: () => void;
  onSwitchMode: () => void;
}

const SignLanguageScreen: React.FC<Props> = ({ onBack, onSwitchMode }) => {
  const cameraRef = useRef<CameraViewHandle>(null);
  const [lastText, setLastText] = useState<string>("Ready to listen...");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const processFrame = async () => {
    if (!cameraRef.current) return;
    
    setIsProcessing(true);
    const base64Image = cameraRef.current.capture();
    
    if (base64Image) {
      const prompt = "Analyze this image for hand gestures or sign language. Return ONLY the translated text message of what the person is saying. If the sign is unclear or not present, reply exactly with: 'Please show the sign more clearly.' Do not include markdown or explanations, just the spoken text.";
      const systemInstruction = "You are an expert sign language interpreter. Your goal is to translate visual signs into clear, spoken-style text. Be encouraging.";
      
      const text = await analyzeImage(base64Image, prompt, systemInstruction);
      setLastText(text);

      // Only speak if it's a valid detection and not the 'unclear' fallback repeated too often
      if (text && !text.includes("Please show the sign more clearly")) {
        const audioData = await generateSpeech(text);
        if (audioData) {
          await playAudioContent(audioData);
        }
      }
    }
    setIsProcessing(false);
  };

  const toggleLiveMode = () => {
    if (isLive) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      setIsLive(false);
    } else {
      setIsLive(true);
      // Process every 5 seconds to avoid rate limits while simulating "live"
      processFrame(); 
      intervalRef.current = window.setInterval(processFrame, 5000);
    }
  };

  const handleManualSpeak = async () => {
    if (lastText) {
      const audioData = await generateSpeech(lastText);
      if (audioData) playAudioContent(audioData);
    }
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex justify-between items-center">
        <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 font-semibold">
          ← Back
        </button>
        <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Sign Mode
        </span>
      </div>

      <CameraView ref={cameraRef} />

      {/* Output Display */}
      <div className="bg-gray-800 p-6 rounded-xl border-2 border-yellow-500/50 min-h-[160px] flex flex-col justify-center items-center text-center mb-6 shadow-inner">
        {isProcessing && !isLive && (
           <div className="text-yellow-400 animate-pulse mb-2">Analyzing gesture...</div>
        )}
        <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
          "{lastText}"
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button 
          variant={isLive ? "danger" : "primary"} 
          onClick={toggleLiveMode}
        >
          {isLive ? "STOP LISTENING" : "START LISTENING"}
        </Button>
        <Button variant="secondary" onClick={handleManualSpeak} disabled={!lastText || isProcessing}>
          REPLAY VOICE
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" onClick={() => setLastText("Ready...")}>
          CLEAR
        </Button>
        <Button variant="outline" onClick={onSwitchMode}>
          VISUAL MODE
        </Button>
      </div>
    </div>
  );
};

export default SignLanguageScreen;