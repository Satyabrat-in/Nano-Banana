
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

export const editImageWithGemini = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<{ newImage: ImageData | null; textResponse: string | null }> => {

  const base64Data = base64ImageData.split(',')[1];
  if (!base64Data) {
    throw new Error("Invalid base64 image data");
  }

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  let newImage: ImageData | null = null;
  let textResponse: string | null = null;

  if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        textResponse = (textResponse || '') + part.text;
      } else if (part.inlineData) {
        const newMimeType = part.inlineData.mimeType;
        const newBase64Data = part.inlineData.data;
        newImage = {
          src: `data:${newMimeType};base64,${newBase64Data}`,
          mimeType: newMimeType,
        };
      }
    }
  }
  
  return { newImage, textResponse };
};
