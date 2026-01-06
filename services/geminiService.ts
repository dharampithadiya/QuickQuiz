
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

export const generateQuizQuestions = async (topic: string): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Generate 5 challenging multiple-choice questions about ${topic}. 
  Return the response strictly as a JSON array where each object has "Question", "Options" (array of 4 strings), and "Answer" (index 0-3).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              Question: { type: Type.STRING },
              Options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              Answer: { type: Type.INTEGER }
            },
            required: ["Question", "Options", "Answer"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as Question[];
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};
