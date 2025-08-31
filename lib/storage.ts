import type { PlantResultData } from '../App';

export interface SavedPlant {
    id: string;
    savedAt: string;
    plantData: PlantResultData;
    imageDataUrl: string;
}

const STORAGE_KEY = 'savedPlants';

export const getSavedPlants = async (): Promise<SavedPlant[]> => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Failed to retrieve saved plants:", error);
        return [];
    }
};

export const getPlantById = async (id: string): Promise<SavedPlant | null> => {
    try {
        const plants = await getSavedPlants();
        return plants.find(plant => plant.id === id) || null;
    } catch (error) {
        console.error(`Failed to retrieve plant by id ${id}:`, error);
        return null;
    }
}

export const savePlant = async (plant: { plantData: PlantResultData; imageDataUrl: string; }): Promise<void> => {
    try {
        const plants = await getSavedPlants();
        const newPlant: SavedPlant = {
            ...plant,
            id: crypto.randomUUID(),
            savedAt: new Date().toISOString(),
        };
        
        const isAlreadySaved = plants.some(p => p.plantData.scientificName === newPlant.plantData.scientificName);
        if (isAlreadySaved) {
            console.log("Plant with this scientific name is already saved.");
            return;
        }

        const updatedPlants = [newPlant, ...plants];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlants));
    } catch (error) {
        console.error("Failed to save plant:", error);
    }
};

export const deletePlant = async (id: string): Promise<void> => {
    try {
        const plants = await getSavedPlants();
        const updatedPlants = plants.filter(plant => plant.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlants));
    } catch (error) {
        console.error("Failed to delete plant:", error);
    }
};
