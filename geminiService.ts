
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeCreditScore(transactions: any[], userProfile: any) {
  const prompt = `Analyze this user's financial health for a loan application. 
  Transactions: ${JSON.stringify(transactions)}
  Profile: ${JSON.stringify(userProfile)}
  
  CRITICAL LOGIC:
  1. If this is a first-time credit request (no "Loan Repayment" in history), the risk is inherently HIGH and the credit score should be between 300-500.
  2. If they have consistent "Electricity", "Data", or "TV" bill payments on time, their score should be boosted.
  3. If they have prior "Loan Repayment" transactions that are successful, their risk level should be LOW or MEDIUM and score should be 650-850.
  4. Quick Nano Loans are for scores > 400. Business Expansion is for scores > 700.
  
  Provide a JSON response with:
  1. creditScore (number between 300 and 850)
  2. riskLevel (string: Low, Medium, High)
  3. keyObservations (array of strings)
  4. improvementTips (array of strings)
  5. maxEligibleAmount (number in user's currency)`;

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

export async function generateBudgetStrategy(goals: any[], balance: number, currency: string) {
  const prompt = `Create a financial saving strategy for a user in ${currency}.
  Goals: ${JSON.stringify(goals)}
  Current Balance: ${balance} ${currency}
  
  Suggest 3 specific actionable steps to achieve these goals faster.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
}

export const createAIChat = () => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: 'You are PayFlow AI, a helpful financial assistant for users in Nigeria, Ghana, and Senegal. You help with budgeting, crypto, bills, and account management.',
    },
  });
};

export async function findNearbyBanksOrAgents(location: { lat: number, lng: number }, query: string) {
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

export const connectLiveAssistant = (callbacks: any) => {
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: 'You are a helpful voice assistant for PayFlow Pro. Help users check balances, pay bills, or explain financial terms.',
    },
  });
};
