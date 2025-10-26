
import React, { useState, useMemo } from 'react';
import { Tab } from './types';
import ImageEditor from './components/ImageEditor';
import ChatBot from './components/ChatBot';
import GroundedSearch from './components/GroundedSearch';
import AdvancedReasoning from './components/AdvancedReasoning';
import Footer from './components/Footer';
import { BrainCircuitIcon, ImagePlayIcon, MessagesSquareIcon, SearchCodeIcon } from './components/icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Editor);

  const TABS = useMemo(() => [
    { id: Tab.Editor, label: 'Image Editor', icon: <ImagePlayIcon className="w-5 h-5 mr-2" /> },
    { id: Tab.Chat, label: 'Chat Bot', icon: <MessagesSquareIcon className="w-5 h-5 mr-2" /> },
    { id: Tab.Search, label: 'Grounded Search', icon: <SearchCodeIcon className="w-5 h-5 mr-2" /> },
    { id: Tab.Reasoning, label: 'Advanced Reasoning', icon: <BrainCircuitIcon className="w-5 h-5 mr-2" /> },
  ], []);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Editor:
        return <ImageEditor />;
      case Tab.Chat:
        return <ChatBot />;
      case Tab.Search:
        return <GroundedSearch />;
      case Tab.Reasoning:
        return <AdvancedReasoning />;
      default:
        return <ImageEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white tracking-wider">
            Gemini AI <span className="text-purple-400">Multi-Tool</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 flex-grow flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-56 flex-shrink-0">
          <nav className="flex flex-row md:flex-col gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center md:justify-start w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        
        <main className="flex-grow bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;
