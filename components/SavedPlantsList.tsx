import React, { useEffect, useState } from 'react';
import { getSavedPlants, SavedPlant } from '../lib/storage';

interface SavedPlantsListProps {
  onSelectPlant: (id: string) => void;
}

export const SavedPlantsList: React.FC<SavedPlantsListProps> = ({ onSelectPlant }) => {
  const [plants, setPlants] = useState<SavedPlant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      setIsLoading(true);
      const savedPlants = await getSavedPlants();
      setPlants(savedPlants);
      setIsLoading(false);
    };
    fetchPlants();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center text-gray-400">
        <p>Carregando plantas salvas...</p>
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="w-full max-w-4xl text-center p-8 bg-gray-800/50 rounded-2xl">
        <h2 className="text-2xl font-bold text-green-400 mb-2">Nenhuma Planta Salva</h2>
        <p className="text-gray-400">Use o analisador de imagens para identificar e salvar suas plantas favoritas.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">Minhas Plantas Salvas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {plants.map((plant) => (
                <button
                key={plant.id}
                onClick={() => onSelectPlant(plant.id)}
                className="group relative aspect-square bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                <img src={plant.imageDataUrl} alt={plant.plantData.plantName} className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-bold text-sm md:text-base truncate">{plant.plantData.plantName}</h3>
                    <p className="text-gray-300 text-xs italic truncate">{plant.plantData.scientificName}</p>
                </div>
                </button>
            ))}
        </div>
    </div>
  );
};
