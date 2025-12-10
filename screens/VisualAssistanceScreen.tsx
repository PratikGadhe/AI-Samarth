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
  const [description, setDescription] = useState<string>("Ask me about your surroundings.");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuery = async (queryType: 'front' | 'location' | 'objects') => {
    if (!cameraRef.current) return;
    
    setIsProcessing(true);
    const base64Image = cameraRef.current.capture();
    
    if (base64Image) {
      let prompt = "";
      switch (queryType) {
        case 'front':
          prompt = "What is directly in front of me? Are there immediate obstacles? Be brief and directive. E.g., 'A chair is 2 feet ahead. Move right.'";
          break;
        case 'location':
          prompt = "Describe where I am (room type, indoor/outdoor) and the general layout. Keep it short.";
          break;
        case 'objects':
          prompt = "List the main objects visible in the scene and their approximate position relative to the camera.";
          break;
      }

      const systemInstruction = "You are a visual assistant for a blind person. Provide short, safe, and actionable descriptions. Prioritize safety hazards. Use a calm, clear tone.";
      
      const text = await analyzeImage(base64Image, prompt, systemInstruction);
      setDescription(text);

      // Auto-speak the response
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
        <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 font-semibold">
          ← Back
        </button>
        <span className="bg-emerald-900 text-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Visual Mode
        </span>
      </div>

      <CameraView ref={cameraRef} />

      {/* Output Display */}
      <div className="bg-gray-800 p-4 rounded-xl border-2 border-emerald-500/50 min-h-[120px] mb-6 shadow-inner">
        {isProcessing && (
           <div className="text-emerald-400 animate-pulse text-sm mb-1">Scanning surroundings...</div>
        )}
        <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
          {description}
        </p>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col gap-4 mb-6">
        <Button 
          variant="primary" 
          onClick={() => handleQuery('front')}
          disabled={isProcessing}
          className="bg-emerald-500 hover:bg-emerald-400 border-emerald-500 text-black"
        >
          WHAT'S IN FRONT?
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
        SWITCH TO SIGN MODE
      </Button>
    </div>
  );
};

export default VisualAssistanceScreen;