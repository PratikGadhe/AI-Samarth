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
  const [lastText, setLastText] = useState<string>("Show me a sign.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAudio, setLastAudio] = useState<string | null>(null);

  const processFrame = async () => {
    if (!cameraRef.current) return;
    
    setIsProcessing(true);
    const base64Image = cameraRef.current.capture();
    
    if (base64Image) {
      // Use 'accuracy' (Pro model) for signs to understand complex gestures
      const prompt = "Identify the hand gesture or sign language in this image. Translate it to English text. If unclear, say 'Please try again'. Return ONLY the translation.";
      const systemInstruction = "You are a sign language interpreter. Output only the spoken text translation.";
      
      const text = await analyzeImage(base64Image, prompt, 'accuracy', systemInstruction);
      setLastText(text);

      if (text && !text.includes("try again")) {
        const audioData = await generateSpeech(text);
        if (audioData) {
          setLastAudio(audioData);
          await playAudioContent(audioData);
        }
      }
    }
    setIsProcessing(false);
  };

  const handleReplay = () => {
    if (lastAudio) playAudioContent(lastAudio);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex justify-between items-center">
        <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 font-bold px-4 py-2 bg-gray-800 rounded-lg">
          ← Back
        </button>
        <span className="bg-blue-900 text-blue-200 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-blue-700">
          Sign Mode
        </span>
      </div>

      <CameraView ref={cameraRef} />

      {/* Output Box */}
      <div className="bg-gray-800 p-6 rounded-2xl border-2 border-blue-500 min-h-[160px] flex flex-col justify-center items-center text-center mb-6 shadow-xl relative overflow-hidden">
        {isProcessing && (
           <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
        )}
        <p className="text-3xl md:text-4xl font-black text-white tracking-wide">
          "{lastText}"
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <Button 
          variant="primary" 
          onClick={processFrame}
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-500 border-blue-400 text-white py-6 text-xl"
        >
          {isProcessing ? "READING..." : "READ SIGN"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="secondary" onClick={handleReplay} disabled={!lastAudio}>
          REPLAY SPEECH
        </Button>
        <Button variant="outline" onClick={onSwitchMode} className="border-blue-500 text-blue-400 hover:bg-gray-800">
          SWITCH MODE
        </Button>
      </div>
    </div>
  );
};

export default SignLanguageScreen;