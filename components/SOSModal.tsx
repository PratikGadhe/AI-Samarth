import React, { useState, useEffect } from 'react';
import Button from './Button';
import { generateSOSMessage } from '../services/geminiService';
import { getContacts, getUserName } from '../services/storageService';
import { Contact } from '../types';

interface SOSModalProps {
  onClose: () => void;
}

const SOSModal: React.FC<SOSModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<'confirm' | 'countdown' | 'sent'>('confirm');
  const [location, setLocation] = useState<string>('Fetching location...');
  const [finalMessage, setFinalMessage] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Load data
    setContacts(getContacts());
    const savedName = getUserName();

    // Get Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(5);
          const lng = position.coords.longitude.toFixed(5);
          const mapLink = `https://maps.google.com/?q=${lat},${lng}`;
          setLocation(mapLink);
          
          // Pre-generate message
          generateSOSMessage(mapLink, savedName ? `Name: ${savedName}` : 'User')
            .then(msg => setFinalMessage(msg));
        },
        () => {
          setLocation("Unknown Location");
          generateSOSMessage("Unknown Location", savedName || 'User')
            .then(msg => setFinalMessage(msg));
        }
      );
    }
  }, []);

  useEffect(() => {
    let timer: number;
    if (step === 'countdown') {
      if (countdown > 0) {
        timer = window.setTimeout(() => setCountdown(c => c - 1), 1000);
      } else {
        setStep('sent');
      }
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handleSendSMS = (phone: string) => {
    const encodedBody = encodeURIComponent(finalMessage);
    window.open(`sms:${phone}?body=${encodedBody}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-red-900/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border-4 border-red-500 rounded-3xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
        {/* Animated Background Pulse */}
        <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black text-red-500 uppercase tracking-widest">Emergency</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white font-bold p-2">✕</button>
          </div>

          {step === 'confirm' && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-xl text-white font-bold">Are you in danger?</p>
              <div className="grid grid-cols-1 gap-4">
                <Button variant="danger" onClick={() => setStep('countdown')} fullWidth className="h-16 text-xl">
                  YES, SEND ALERT
                </Button>
                <Button variant="secondary" onClick={onClose} fullWidth>
                  I'M SAFE
                </Button>
              </div>
            </div>
          )}

          {step === 'countdown' && (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4 font-bold">PREPARING ALERT IN</p>
              <div className="text-8xl font-black text-white mb-8">{countdown}</div>
              <Button variant="secondary" onClick={() => setStep('sent')} fullWidth>
                SEND NOW
              </Button>
              <button onClick={onClose} className="mt-4 text-gray-400 underline">Cancel</button>
            </div>
          )}

          {step === 'sent' && (
            <div className="space-y-4">
               <div className="bg-red-950 p-4 rounded-xl border border-red-800 mb-4">
                <p className="text-white text-sm whitespace-pre-wrap">{finalMessage}</p>
               </div>
               
               <p className="text-center text-gray-300 font-bold mb-2">Select contact to send SMS:</p>
               
               <div className="max-h-60 overflow-y-auto space-y-3">
                 {contacts.length > 0 ? (
                   contacts.map(contact => (
                     <button
                        key={contact.id}
                        onClick={() => handleSendSMS(contact.phone)}
                        className="w-full flex justify-between items-center bg-gray-800 hover:bg-gray-700 p-4 rounded-xl border border-gray-600 transition-colors"
                     >
                       <span className="font-bold text-white">{contact.name}</span>
                       <span className="text-green-400 font-mono">SMS ➜</span>
                     </button>
                   ))
                 ) : (
                   <div className="text-center text-yellow-500 py-2 border border-yellow-500/30 rounded bg-yellow-900/10">
                     No emergency contacts saved.
                     <br/><span className="text-xs">Go to Settings to add contacts.</span>
                   </div>
                 )}
                 
                 {/* Fallback to generic SMS if supported on device to pick contact */}
                 <button
                    onClick={() => handleSendSMS('')}
                    className="w-full bg-gray-700 hover:bg-gray-600 p-4 rounded-xl border border-gray-500 font-bold text-white"
                 >
                   Open SMS App
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOSModal;