
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { getLanguage } from "./localization";

export async function generateImage(prompt: string, size: "1K" | "2K" | "4K" = "1K", aspectRatio: "1:1" | "16:9" | "9:16" | "4:3" | "3:4" = "1:1") {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: size
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned from Gemini");
}

export async function editImage(imagePath: string, prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const [header, data] = imagePath.split(',');
  const mimeType = header.split(':')[1].split(';')[0];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: data,
            mimeType: mimeType,
          },
        },
        {
          text: prompt
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned from Gemini");
}

export async function analyzeCreditScore(transactions: any[], userProfile: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const lang = getLanguage(userProfile.country);
  const prompt = `Analyze this user's financial health for a loan application. 
  Transactions: ${JSON.stringify(transactions)}
  Profile: ${JSON.stringify(userProfile)}
  
  CRITICAL LOGIC:
  1. If this is a first-time credit request (no "Loan Repayment" in history), the risk is inherently HIGH and the credit score should be between 300-500.
  2. If they have consistent "Electricity", "Data", or "TV" bill payments on time, their score should be boosted.
  3. If they have prior "Loan Repayment" transactions that are successful, their risk level should be LOW or MEDIUM and score should be 650-850.
  
  RESPONSE LANGUAGE: ${lang === 'fr' ? 'FRENCH' : 'ENGLISH'}.
  
  Provide a JSON response with creditScore, riskLevel, keyObservations, improvementTips, and maxEligibleAmount.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          creditScore: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING },
          keyObservations: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          maxEligibleAmount: { type: Type.NUMBER },
        },
        required: ["creditScore", "riskLevel", "keyObservations", "improvementTips", "maxEligibleAmount"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateBudgetStrategy(goals: any[], balance: number, currency: string, country: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const lang = getLanguage(country);
  const prompt = `Create a financial saving strategy for a user in ${currency}.
  Goals: ${JSON.stringify(goals)}
  Current Balance: ${balance} ${currency}
  RESPONSE LANGUAGE: ${lang === 'fr' ? 'FRENCH' : 'ENGLISH'}.
  Suggest 3 specific actionable steps.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
}

export const createAIChat = (country: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const lang = getLanguage(country);
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are PayFlow AI, a helpful financial assistant for users in Nigeria, Ghana, and Senegal. ALWAYS RESPOND IN ${lang === 'fr' ? 'FRENCH' : 'ENGLISH'}.`,
    },
  });
};

export async function findNearbyBanksOrAgents(location: { lat: number, lng: number }, query: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find ${query} near these coordinates: ${location.lat}, ${location.lng}`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: location.lat,
            longitude: location.lng
          }
        }
      }
    },
  });
  
  const text = response.text;
  const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  return { text, grounding };
}

export const connectLiveAssistant = (callbacks: any, country: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const lang = getLanguage(country);
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: `You are a helpful voice assistant for PayFlow Pro. ALWAYS SPEAK IN ${lang === 'fr' ? 'FRENCH' : 'ENGLISH'}.`,
    },
  });
};
