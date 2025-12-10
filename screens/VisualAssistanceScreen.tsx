import React, { useRef, useState } from 'react';
import CameraView, { CameraViewHandle } from '../components/CameraView';
import Button from '../components/Button';
import { analyzeImage, generateSpeech } from '../services/geminiService';
import { playAudioContent } from '../utils/audioUtils';

interface Props {
  onBack: () => void;
  onSwitchMode: () => void;
}

const VisualAssistanceScreen: React.FC<Props> = ({ onBack, onSwitchMode }) => {
  const cameraRef = useRef<CameraViewHandle>(null);
  const [description, setDescription] = useState<string>("Ready to assist.");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuery = async (queryType: 'front' | 'location' | 'objects') => {
    if (!cameraRef.current) return;
    
    setIsProcessing(true);
    const base64Image = cameraRef.current.capture();
    
    if (base64Image) {
      let prompt = "";
      switch (queryType) {
        case 'front':
          prompt = "What is directly in front of me? Are there immediate obstacles? Answer in 1 short sentence.";
          break;
        case 'location':
          prompt = "Where am I? (e.g., kitchen, park, office). Keep it very brief.";
          break;
        case 'objects':
          prompt = "List the main objects visible in the scene. Be concise.";
          break;
      }

      // Use 'speed' (Flash model) for visual assistance to be responsive
      const text = await analyzeImage(base64Image, prompt, 'speed', "You are a visual assistant. Be concise and practical.");
      setDescription(text);

      const audioData = await generateSpeech(text);
      if (audioData) {
        await playAudioContent(audioData);
      }
    }
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full">
       <div className="mb-4 flex justify-between items-center">
        <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 font-bold px-4 py-2 bg-gray-800 rounded-lg">
          ← Back
        </button>
        <span className="bg-emerald-900 text-emerald-300 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-700">
          Visual Mode
        </span>
      </div>

      <CameraView ref={cameraRef} />

      {/* Output Display */}
      <div className="bg-gray-800 p-6 rounded-2xl border-2 border-emerald-500 mb-6 shadow-xl min-h-[140px] flex items-center justify-center relative overflow-hidden">
        {isProcessing && (
           <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-pulse"></div>
        )}
        <p className="text-xl md:text-2xl text-white font-bold leading-relaxed text-center">
          {isProcessing ? "Scanning..." : description}
        </p>
      </div>

      {/* Primary Actions - Specific buttons from requirements */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <Button 
          variant="primary" 
          onClick={() => handleQuery('front')}
          disabled={isProcessing}
          className="bg-emerald-500 hover:bg-emerald-400 border-emerald-500 text-black py-6 text-xl"
        >
          WHAT'S IN FRONT OF ME?
        </Button>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" onClick={() => handleQuery('location')} disabled={isProcessing}>
            WHERE AM I?
          </Button>
          <Button variant="secondary" onClick={() => handleQuery('objects')} disabled={isProcessing}>
            DESCRIBE OBJECTS
          </Button>
        </div>
      </div>

      {/* Secondary Actions */}
      <Button variant="outline" onClick={onSwitchMode} className="border-emerald-500 text-emerald-400 hover:bg-gray-800">
        SWITCH MODE 
      </Button>
    </div>
  );
};

export default VisualAssistanceScreen;