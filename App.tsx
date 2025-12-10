import React, { useState } from 'react';
import { AppMode } from './types';
import HomeScreen from './screens/HomeScreen';
import SignLanguageScreen from './screens/SignLanguageScreen';
import VisualAssistanceScreen from './screens/VisualAssistanceScreen';
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
      case AppMode.HOME:
      default:
        return <HomeScreen onNavigate={setCurrentMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative font-sans selection:bg-yellow-500 selection:text-black">
      {/* Header */}
      <header className="p-4 bg-gray-800 border-b-4 border-yellow-500 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-xl md:text-2xl font-bold tracking-wider text-yellow-400">AI SAMARTH</h1>
        <button
          onClick={() => setShowSOS(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded border-2 border-white animate-pulse"
          aria-label="Emergency SOS"
        >
          SOS
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-2xl p-4 pb-24">
        {renderScreen()}
      </main>

      {/* SOS Modal Overlay */}
      {showSOS && (
        <SOSModal onClose={() => setShowSOS(false)} />
      )}
    </div>
  );
};

export default App;