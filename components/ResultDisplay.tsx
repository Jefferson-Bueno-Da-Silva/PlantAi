import React from 'react';
import { Loader } from './Loader';
import { WaterIcon, SunIcon, FertilizerIcon, WarningIcon, PetIcon, BookmarkIcon } from './Icon';
import type { PlantResultData } from '../App';
import { Button } from './Button';

interface ResultDisplayProps {
  isLoading: boolean;
  loadingMessage: string;
  result: PlantResultData | null;
  error: string | null;
  onSave: () => void;
  isSaved: boolean;
}

const InfoItem: React.FC<{ icon: React.ReactNode, label: string, value: string, isWarning?: boolean }> = ({ icon, label, value, isWarning = false }) => {
    const valueColor = isWarning ? 'text-red-400 font-bold' : 'text-gray-200';
    return (
        <div className="flex items-start p-3 bg-gray-900/50 rounded-lg transition-colors hover:bg-gray-900">
            <div className="flex-shrink-0 w-6 h-6 mr-4 text-green-400 pt-1">{icon}</div>
            <div className="flex-1">
                <p className="font-semibold text-gray-400 text-sm">{label}</p>
                <p className={`font-medium ${valueColor}`}>{value}</p>
            </div>
        </div>
    );
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, loadingMessage, result, error, onSave, isSaved }) => {
  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-gray-700/30 rounded-lg">
        <Loader />
        <p className="mt-4 text-lg font-semibold text-green-300 animate-pulse">{loadingMessage || 'Analisando...'}</p>
        <p className="text-gray-400">A IA está trabalhando, aguarde um momento.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300">
        <h3 className="font-bold text-lg mb-2">Análise Falhou</h3>
        <p className="text-sm max-w-sm">{error}</p>
      </div>
    );
  }
  
  if (result) {
    if (!result.isPlant) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-gray-700/30 rounded-lg">
                <p className="font-bold text-lg text-yellow-400">Não é uma Planta</p>
                <p className="text-gray-300 mt-2 max-w-sm">{result.reasoning || "A IA não conseguiu identificar uma planta na imagem."}</p>
            </div>
        );
    }

    return (
        <div className="flex-grow flex flex-col p-1" style={{ scrollbarWidth: 'thin' }}>
          <div className="flex-grow overflow-y-auto max-h-[45vh] lg:max-h-full pr-2">
            <div className="p-3 md:p-5 bg-gray-700/30 rounded-lg">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-green-300">{result.plantName || 'Planta Desconhecida'}</h3>
                    <p className="text-sm text-gray-400 italic">{result.scientificName || 'Nome científico não disponível'}</p>
                </div>
                <div className="space-y-3">
                    <InfoItem icon={<WaterIcon />} label="Rega" value={result.watering || 'Não especificado'} />
                    <InfoItem icon={<SunIcon />} label="Luz Ideal" value={result.light || 'Não especificado'} />
                    <InfoItem icon={<FertilizerIcon />} label="Adubo Indicado" value={result.fertilizer || 'Não especificado'} />
                    <InfoItem icon={<WarningIcon />} label="Venenosa para Humanos" value={result.isPoisonous ? 'Sim' : 'Não'} isWarning={!!result.isPoisonous} />
                    <InfoItem icon={<PetIcon />} label="Perigo para Pets" value={result.petDanger ? 'Sim' : 'Não'} isWarning={!!result.petDanger} />
                </div>
            </div>
          </div>
          <div className="mt-4 flex-shrink-0">
            <Button onClick={onSave} disabled={isSaved} variant="secondary">
                <BookmarkIcon className="w-5 h-5 mr-2"/>
                {isSaved ? 'Salvo!' : 'Salvar Planta'}
            </Button>
          </div>
        </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-gray-700/30 rounded-lg">
      <p className="text-gray-400">A análise da sua planta aparecerá aqui quando for concluída.</p>
    </div>
  );
};
