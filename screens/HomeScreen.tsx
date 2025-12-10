import React from 'react';
import { AppMode } from '../types';

interface HomeProps {
  onNavigate: (mode: AppMode) => void;
}

const HomeScreen: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col space-y-6 mt-4">
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-3xl font-bold text-white">Welcome</h2>
        <p className="text-gray-400">Select an assistance mode to begin.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Feature 1: Sign Language */}
        <button
          onClick={() => onNavigate(AppMode.SIGN_TO_SPEECH)}
          className="group relative overflow-hidden rounded-3xl bg-blue-600 p-8 text-left shadow-2xl transition-all hover:bg-blue-500 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-yellow-400"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11" />
            </svg>
          </div>
          <div className="relative z-10">
            <span className="inline-block bg-white/20 p-3 rounded-xl mb-4">
               <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </span>
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">Sign to Speech</h2>
            <p className="text-blue-100 font-medium text-lg">Translate gestures into voice instantly.</p>
          </div>
        </button>

        {/* Feature 2: Visual Assistance */}
        <button
          onClick={() => onNavigate(AppMode.VISUAL_ASSISTANCE)}
          className="group relative overflow-hidden rounded-3xl bg-emerald-600 p-8 text-left shadow-2xl transition-all hover:bg-emerald-500 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-yellow-400"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div className="relative z-10">
            <span className="inline-block bg-white/20 p-3 rounded-xl mb-4">
               <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
               </svg>
            </span>
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">Visual Helper</h2>
            <p className="text-emerald-100 font-medium text-lg">Identify surroundings & obstacles.</p>
          </div>
        </button>

        {/* Emergency Setup */}
         <button
          onClick={() => onNavigate(AppMode.SETTINGS)}
          className="rounded-2xl border-2 border-gray-700 bg-gray-800 p-6 flex items-center justify-between hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="bg-red-900/50 p-3 rounded-full text-red-500">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white">Emergency Contacts</h3>
              <p className="text-sm text-gray-400">Setup SOS recipients</p>
            </div>
          </div>
          <span className="text-gray-500">→</span>
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;