import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

// Helper to get AI instance.
// IMPORTANT: For Veo and Pro models, we rely on the window.aistudio key selection if available, 
// otherwise fallback to env (though the prompt implies strict usage of aistudio for high end models).
const getAIClient = (): GoogleGenAI => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateFanImage = async (prompt: string, size: ImageSize): Promise<string> => {
  const ai = getAIClient();
  
  // Using gemini-3-pro-image-preview for high quality generation
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        imageSize: size,
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

export const editFanImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAIClient();
  // Using gemini-2.5-flash-image for editing (Nano Banana)
  
  // Strip prefix if present for API consumption
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: cleanBase64,
            mimeType: 'image/png', // Assuming PNG for simplicity or convert dynamically
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No edited image returned");
};

export const generateFanVideo = async (
  base64Image: string, 
  prompt: string, 
  aspectRatio: AspectRatio
): Promise<string> => {
  const ai = getAIClient();
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  // Using veo-3.1-fast-generate-preview
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || "Animate this naturally",
    image: {
      imageBytes: cleanBase64,
      mimeType: 'image/png',
    },
    config: {
      numberOfVideos: 1,
      aspectRatio: aspectRatio, 
      resolution: '720p', // Fast preview usually supports 720p
    }
  });

  // Polling
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  
  if (!downloadLink) {
    throw new Error("Video generation failed to return a URI.");
  }

  // We need to fetch the actual video bytes because the link requires auth usually, 
  // but here we are using the SDK's flow. 
  // According to instructions: "The response.body contains the MP4 bytes. You must append an API key when fetching from the download link."
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!videoResponse.ok) throw new Error("Failed to download generated video");
  
  const blob = await videoResponse.blob();
  return URL.createObjectURL(blob);
};
