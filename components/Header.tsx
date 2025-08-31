import React from 'react';
import { PlantIcon, ListBulletIcon } from './Icon';

interface HeaderProps {
    onNavigateHome: () => void;
    onNavigateToList: () => void;
    currentView: 'analyzer' | 'list' | 'detail';
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome, onNavigateToList, currentView }) => {
  const isAnalyzerActive = currentView === 'analyzer';
  const isListActive = currentView === 'list' || currentView === 'detail';
  
  return (
    <header className="p-4 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <button onClick={onNavigateHome} className={`flex items-center gap-3 transition-opacity ${isAnalyzerActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
            <PlantIcon className="w-8 h-8 text-green-400" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
              IA Identificador de Plantas
            </h1>
        </button>

        <button 
            onClick={onNavigateToList}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isListActive ? 'bg-green-500/20 text-green-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'}`}
        >
            <ListBulletIcon className="w-5 h-5" />
            <span className="font-semibold">Minhas Plantas</span>
        </button>
      </div>
    </header>
  );
};
