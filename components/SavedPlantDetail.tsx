import React, { useEffect, useState } from 'react';
import { getPlantById, SavedPlant } from '../lib/storage';
import { Loader } from './Loader';
import { Button } from './Button';
import { ArrowLeftIcon, TrashIcon, WaterIcon, SunIcon, FertilizerIcon, WarningIcon, PetIcon } from './Icon';

interface SavedPlantDetailProps {
  plantId: string;
  onBack: () => void;
  onDelete: (id: string) => void;
}

const InfoItem: React.FC<{ icon: React.ReactNode, label: string, value: string, isWarning?: boolean }> = ({ icon, label, value, isWarning = false }) => {
    const valueColor = isWarning ? 'text-red-400 font-bold' : 'text-gray-200';
    return (
        <div className="flex items-start p-3 bg-gray-900/50 rounded-lg">
            <div className="flex-shrink-0 w-6 h-6 mr-4 text-green-400 pt-1">{icon}</div>
            <div className="flex-1">
                <p className="font-semibold text-gray-400 text-sm">{label}</p>
                <p className={`font-medium ${valueColor}`}>{value}</p>
            </div>
        </div>
    );
};

export const SavedPlantDetail: React.FC<SavedPlantDetailProps> = ({ plantId, onBack, onDelete }) => {
  const [plant, setPlant] = useState<SavedPlant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlant = async () => {
      setIsLoading(true);
      const foundPlant = await getPlantById(plantId);
      setPlant(foundPlant);
      setIsLoading(false);
    };
    fetchPlant();
  }, [plantId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader /></div>;
  }

  if (!plant) {
    return (
      <div className="text-center">
        <p className="text-red-400">Planta não encontrada.</p>
        <Button onClick={onBack} variant="secondary" className="mt-4">Voltar para a Lista</Button>
      </div>
    );
  }

  const { plantData, imageDataUrl } = plant;

  return (
    <div className="w-full max-w-4xl bg-gray-800/50 rounded-2xl shadow-2xl shadow-green-500/10 backdrop-blur-sm border border-gray-700/50 overflow-hidden">
        <div className="relative p-4 md:p-6 flex items-center justify-between border-b border-gray-700/50">
            <Button onClick={onBack} variant="secondary">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Voltar
            </Button>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-green-300">{plantData.plantName}</h2>
                <p className="text-sm text-gray-400 italic">{plantData.scientificName}</p>
            </div>
            <Button onClick={() => onDelete(plant.id)} variant="secondary" className="bg-red-800/50 hover:bg-red-700/80 text-red-300 focus:ring-red-500">
                <TrashIcon className="w-5 h-5" />
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-6">
            <div className="aspect-square bg-gray-700/50 rounded-lg overflow-hidden">
                <img src={imageDataUrl} alt={plantData.plantName} className="w-full h-full object-contain" />
            </div>
            <div className="space-y-3 flex flex-col justify-center">
                <InfoItem icon={<WaterIcon />} label="Rega" value={plantData.watering || 'Não especificado'} />
                <InfoItem icon={<SunIcon />} label="Luz Ideal" value={plantData.light || 'Não especificado'} />
                <InfoItem icon={<FertilizerIcon />} label="Adubo Indicado" value={plantData.fertilizer || 'Não especificado'} />
                <InfoItem icon={<WarningIcon />} label="Venenosa para Humanos" value={plantData.isPoisonous ? 'Sim' : 'Não'} isWarning={!!plantData.isPoisonous} />
                <InfoItem icon={<PetIcon />} label="Perigo para Pets" value={plantData.petDanger ? 'Sim' : 'Não'} isWarning={!!plantData.petDanger} />
            </div>
        </div>
    </div>
  );
};
