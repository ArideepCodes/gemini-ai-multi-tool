
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { GroundingChunk } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function editImageWithGemini(
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64ImageData, mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("No image data found in the Gemini response.");
}

export async function getGroundedSearchResponse(query: string): Promise<{ text: string; sources: GroundingChunk[] }> {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text, sources: sources as GroundingChunk[] };
}

export async function getAdvancedReasoningResponse(prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 32768 },
        },
    });
    return response.text;
}
