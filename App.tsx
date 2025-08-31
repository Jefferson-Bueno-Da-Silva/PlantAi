import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageInput } from './components/ImageInput';
import { ResultDisplay } from './components/ResultDisplay';
import { analyzePlantImage } from './services/geminiService';
import { Button } from './components/Button';
import { SparklesIcon } from './components/Icon';
import { SavedPlant, savePlant, getSavedPlants, deletePlant } from './lib/storage';
import { SavedPlantsList } from './components/SavedPlantsList';
import { SavedPlantDetail } from './components/SavedPlantDetail';

export interface PlantResultData {
    isPlant: boolean;
    plantName?: string;
    scientificName?: string;
    watering?: string;
    light?: string;
    fertilizer?: string;
    isPoisonous?: boolean;
    petDanger?: boolean;
    reasoning?: string;
}

type View = 'analyzer' | 'list' | 'detail';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<PlantResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [view, setView] = useState<View>('analyzer');
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [isCurrentPlantSaved, setIsCurrentPlantSaved] = useState(false);

  useEffect(() => {
    if (view === 'analyzer' && result?.isPlant && result.scientificName) {
      const checkSaved = async () => {
        const savedPlants = await getSavedPlants();
        const isSaved = savedPlants.some(p => p.plantData.scientificName === result.scientificName);
        setIsCurrentPlantSaved(isSaved);
      };
      checkSaved();
    } else {
      setIsCurrentPlantSaved(false);
    }
  }, [result, view]);

  const handleImageSelect = useCallback((imageDataUrl: string) => {
    setImage(imageDataUrl);
    setResult(null);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    setImage(null);
    setResult(null);
    setError(null);
    setIsCurrentPlantSaved(false);
  }, []);

  const handleRecognize = useCallback(async () => {
    if (!image) {
      setError("Por favor, selecione uma imagem primeiro.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLoadingMessage('Analisando imagem...');

    try {
      const analysis = await analyzePlantImage(image);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [image]);

  const handleSavePlant = useCallback(async () => {
    if (result && image && result.isPlant) {
      await savePlant({ plantData: result, imageDataUrl: image });
      setIsCurrentPlantSaved(true);
    }
  }, [result, image]);

  const handleDeletePlant = useCallback(async (id: string) => {
    await deletePlant(id);
    setView('list');
  }, []);

  const handleSelectPlant = (id: string) => {
    setSelectedPlantId(id);
    setView('detail');
  };
  
  const renderContent = () => {
    switch (view) {
      case 'list':
        return <SavedPlantsList onSelectPlant={handleSelectPlant} />;
      case 'detail':
        return selectedPlantId ? <SavedPlantDetail plantId={selectedPlantId} onBack={() => setView('list')} onDelete={handleDeletePlant} /> : null;
      case 'analyzer':
      default:
        return (
          <div className="w-full max-w-6xl bg-gray-800/50 rounded-2xl shadow-2xl shadow-green-500/10 backdrop-blur-sm border border-gray-700/50 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
              <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gray-700/50 flex flex-col">
                <ImageInput onImageSelect={handleImageSelect} onClear={handleClear} currentImage={image} />
              </div>
              <div className="p-6 md:p-8 flex flex-col">
                <div className="flex-grow flex flex-col">
                  <h2 className="text-2xl font-bold text-green-400 mb-4">Resultado da Análise</h2>
                  <ResultDisplay isLoading={isLoading} loadingMessage={loadingMessage} result={result} error={error} onSave={handleSavePlant} isSaved={isCurrentPlantSaved} />
                </div>
                <div className="mt-6">
                  <Button onClick={handleRecognize} disabled={!image || isLoading} variant="primary">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Analisando...' : 'Analisar Imagem'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header onNavigateHome={() => setView('analyzer')} onNavigateToList={() => setView('list')} currentView={view} />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Desenvolvido com a API Gemini. Projetado para experiências de usuário incríveis.</p>
      </footer>
    </div>
  );
}
