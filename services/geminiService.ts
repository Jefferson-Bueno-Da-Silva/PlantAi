import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PlantResultData } from "../App";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function dataUrlToBlob(dataUrl: string): { mimeType: string; data: string } {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid data URL format");
  }
  const [_, mimeType, data] = match;
  return { mimeType, data };
}

export const analyzePlantImage = async (
  imageDataUrl: string
): Promise<PlantResultData> => {
  try {
    const { mimeType, data } = dataUrlToBlob(imageDataUrl);
    const imagePart = { inlineData: { mimeType, data } };

    const prompt = `Analise a imagem e use a pesquisa Google para obter informações. Responda em português do Brasil.
A resposta DEVE SER um único objeto JSON, sem markdown ou qualquer outro texto.
As respostas de cuidados devem ser OBJETIVAS, CONCISAS e DIRETAS. NÃO inclua fontes.

Se a imagem contiver uma planta, retorne o JSON:
{
  "isPlant": true,
  "plantName": "Nome Comum da Planta",
  "scientificName": "Nome Científico da Planta",
  "watering": "Seja direto e objetivo. Ex: 'Regue 2-3 vezes por semana, quando o solo estiver seco. Evite encharcar.'",
  "light": "Seja direto. Ex: 'Luz indireta brilhante. Evite sol direto por longos períodos.'",
  "fertilizer": "Seja direto. Ex: 'Adubo NPK 10-10-10 a cada 2 meses durante a primavera/verão.'",
  "isPoisonous": true,
  "petDanger": false,
  "reasoning": null
}

Se a imagem NÃO contiver uma planta, retorne o JSON:
{
  "isPlant": false,
  "plantName": null,
  "scientificName": null,
  "watering": null,
  "light": null,
  "fertilizer": null,
  "isPoisonous": null,
  "petDanger": null,
  "reasoning": "Explique de forma concisa por que a imagem não parece ser de uma planta."
}`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        tools: [
          {
            googleSearch: {},
          },
        ],
      },
    });

    const text = response.text;
    if (!text) throw new Error("A API de análise retornou uma resposta vazia.");

    // Clean potential markdown and parse
    const cleanedJson = text.replace(/^```json\s*|```$/g, "").trim();
    const analysis = JSON.parse(cleanedJson);

    return analysis;
  } catch (error) {
    console.error("Error analyzing plant image:", error);
    if (error instanceof Error) {
      // Check for parsing errors specifically
      if (error.name === "SyntaxError") {
        throw new Error(
          `Falha ao processar a resposta da IA. Formato JSON inválido recebido.`
        );
      }
      throw new Error(`Falha ao analisar a imagem: ${error.message}`);
    }
    throw new Error("Ocorreu um erro inesperado ao analisar a imagem.");
  }
};
