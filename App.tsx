import React, { useState } from 'react';
import { AppMode } from './types';
import HomeScreen from './screens/HomeScreen';
import SignLanguageScreen from './screens/SignLanguageScreen';
import VisualAssistanceScreen from './screens/VisualAssistanceScreen';
import SettingsScreen from './screens/SettingsScreen';
import SOSModal from './components/SOSModal';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.HOME);
  const [showSOS, setShowSOS] = useState(false);

  const renderScreen = () => {
    switch (currentMode) {
      case AppMode.SIGN_TO_SPEECH:
        return <SignLanguageScreen onBack={() => setCurrentMode(AppMode.HOME)} onSwitchMode={() => setCurrentMode(AppMode.VISUAL_ASSISTANCE)} />;
      case AppMode.VISUAL_ASSISTANCE:
        return <VisualAssistanceScreen onBack={() => setCurrentMode(AppMode.HOME)} onSwitchMode={() => setCurrentMode(AppMode.SIGN_TO_SPEECH)} />;
      case AppMode.SETTINGS:
        return <SettingsScreen onBack={() => setCurrentMode(AppMode.HOME)} />;
      case AppMode.HOME:
      default:
        return <HomeScreen onNavigate={setCurrentMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative font-sans selection:bg-yellow-500 selection:text-black">
      {/* Header */}
      <header className="p-4 bg-gray-800 border-b-4 border-yellow-500 flex justify-between items-center sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-2">
           <div className="bg-yellow-500 rounded-md p-1">
             <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
             </svg>
           </div>
           <h1 className="text-xl md:text-2xl font-black tracking-wider text-yellow-400">AI SAMARTH</h1>
        </div>
        
        {currentMode === AppMode.HOME && (
          <button 
            onClick={() => setCurrentMode(AppMode.SETTINGS)}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-2xl p-4 pb-32">
        {renderScreen()}
      </main>

      {/* Floating SOS Button (Global) */}
      <button
        onClick={() => setShowSOS(true)}
        className="fixed bottom-6 right-6 w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 animate-bounce active:scale-95 z-50 hover:bg-red-500 transition-colors"
        aria-label="Emergency SOS"
      >
        <span className="text-white font-black text-xl tracking-widest">SOS</span>
      </button>

      {/* SOS Modal Overlay */}
      {showSOS && (
        <SOSModal onClose={() => setShowSOS(false)} />
      )}
    </div>
  );
};

export default App;