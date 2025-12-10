import React, { useState, useEffect } from 'react';
import Button from './Button';
import { generateSOSMessage } from '../services/geminiService';

interface SOSModalProps {
  onClose: () => void;
}

const SOSModal: React.FC<SOSModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<'confirm' | 'details' | 'sending' | 'sent'>('confirm');
  const [location, setLocation] = useState<string>('Fetching location...');
  const [userName, setUserName] = useState('');
  const [finalMessage, setFinalMessage] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        () => {
          setLocation("Unknown Location");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  const handleSend = async () => {
    setStep('sending');
    const msg = await generateSOSMessage(location, userName ? `Name: ${userName}` : 'User did not provide name');
    setFinalMessage(msg);
    setStep('sent');
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border-4 border-red-600 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-3xl font-black text-red-500 mb-6 text-center uppercase tracking-widest">Emergency SOS</h2>

        {step === 'confirm' && (
          <div className="space-y-6">
            <p className="text-xl text-white text-center">Are you safe? Do you want to generate an emergency alert?</p>
            <div className="grid grid-cols-1 gap-4">
              <Button variant="danger" onClick={() => setStep('details')} fullWidth>
                YES, I NEED HELP
              </Button>
              <Button variant="secondary" onClick={onClose} fullWidth>
                NO, CANCEL
              </Button>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-4">
            <div>
              <label className="block text-yellow-400 font-bold mb-2">Your Name (Optional)</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-gray-900 border-2 border-gray-600 rounded-lg p-3 text-white focus:border-yellow-400 outline-none"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-yellow-400 font-bold mb-2">Location</label>
              <div className="p-3 bg-gray-900 rounded-lg text-gray-300 font-mono text-sm border border-gray-700">
                {location}
              </div>
            </div>
            <Button variant="danger" onClick={handleSend} fullWidth className="mt-4">
              GENERATE ALERT
            </Button>
          </div>
        )}

        {step === 'sending' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
            <p className="text-xl font-bold animate-pulse">Generating Alert...</p>
          </div>
        )}

        {step === 'sent' && (
          <div className="space-y-4">
             <div className="bg-red-900/30 p-4 rounded-lg border border-red-500">
              <p className="text-white whitespace-pre-wrap font-medium">{finalMessage}</p>
             </div>
             <p className="text-sm text-gray-400 text-center">Copy the message above or screenshot this screen.</p>
             <Button variant="primary" onClick={onClose} fullWidth>
               CLOSE
             </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOSModal;