import React from 'react';
import { AppMode } from '../types';
import Button from '../components/Button';

interface HomeProps {
  onNavigate: (mode: AppMode) => void;
}

const HomeScreen: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col space-y-8 mt-8">
      <div className="text-center space-y-2">
        <p className="text-gray-300 text-lg">Choose your assistance mode</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <button
          onClick={() => onNavigate(AppMode.SIGN_TO_SPEECH)}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-left shadow-lg transition-transform hover:scale-[1.02] focus:ring-4 focus:ring-yellow-400"
        >
          <div className="relative z-10">
            <div className="mb-4 inline-block rounded-full bg-white/20 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Sign-to-Speech</h2>
            <p className="text-blue-100">Convert hand gestures to spoken voice.</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate(AppMode.VISUAL_ASSISTANCE)}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-left shadow-lg transition-transform hover:scale-[1.02] focus:ring-4 focus:ring-yellow-400"
        >
          <div className="relative z-10">
            <div className="mb-4 inline-block rounded-full bg-white/20 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Visual Assistance</h2>
            <p className="text-emerald-100">Identify objects and describe surroundings.</p>
          </div>
        </button>
      </div>

      <div className="mt-12 bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-yellow-400 mb-2">How to use</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Select a mode above.</li>
          <li>Allow camera access when prompted.</li>
          <li>Use the large SOS button at the top for emergencies.</li>
        </ul>
      </div>
    </div>
  );
};

export default HomeScreen;