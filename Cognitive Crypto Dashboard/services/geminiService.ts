import { GoogleGenAI, Type } from "@google/genai";
import { CryptoData, AnalysisResult } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeMarket = async (data: CryptoData[]): Promise<AnalysisResult> => {
  if (!apiKey) {
    return {
      summary: "AI Configuration missing. Unable to generate cognitive insights.",
      sentiment: 'neutral',
      keyFactors: ["System Config"]
    };
  }

  // Prepare a "Cold Data" digest for the AI
  const marketSummary = data.slice(0, 5).map(c => 
    `${c.name}: $${c.current_price} (${c.price_change_percentage_24h.toFixed(2)}%)`
  ).join('\n');

  const prompt = `
    You are a senior financial analyst assistant. 
    Analyze this snapshot of the crypto market:
    ${marketSummary}

    Provide a calm, 1-sentence overview of the market mood designed to reduce anxiety.
    Determine the sentiment (bullish, bearish, or neutral).
    List 3 short key drivers or observations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            sentiment: { type: Type.STRING },
            keyFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "sentiment", "keyFactors"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    const parsed = JSON.parse(text);

    return {
      summary: parsed.summary || "Market analysis unavailable at this moment.",
      sentiment: (parsed.sentiment as 'bullish' | 'bearish' | 'neutral') || "neutral",
      keyFactors: parsed.keyFactors || ["Data volatility"]
    };

  } catch (error) {
    console.error("Gemini analysis failed", error);
    return {
      summary: "Market appears active. Automated analysis temporarily unavailable.",
      sentiment: "neutral",
      keyFactors: ["API Limit", "Network Congestion"]
    };
  }
};