
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

export const generateQuizQuestions = async (topic: string): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Generate 5 challenging multiple-choice questions about ${topic}. 
  Return the response strictly as a JSON array where each object has "Question", "Options" (array of 4 strings), "Answer" (index 0-3), and "Explanation" (a 1-2 line explanation).`;

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
              Answer: { type: Type.INTEGER },
              Explanation: { type: Type.STRING }
            },
            required: ["Question", "Options", "Answer", "Explanation"]
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
