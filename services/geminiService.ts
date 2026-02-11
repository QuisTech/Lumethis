import { GoogleGenAI, Type } from "@google/genai";
import { AIPlanResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTrainingStrategy = async (
  topic: string,
  targetAudience: string,
  duration: string
): Promise<AIPlanResponse | null> => {
  try {
    const prompt = `
      Act as a Senior L&D Consultant. 
      Design a structured training program for: "${topic}".
      Target Audience: ${targetAudience}.
      Desired Duration: ${duration}.
      
      Return a JSON object with a catchy Title, a brief Overview, and a list of Modules.
      Each module should have a name, 2-3 learning objectives, and estimated duration.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            overview: { type: Type.STRING },
            modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  objectives: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  duration: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AIPlanResponse;

  } catch (error) {
    console.error("Error generating strategy:", error);
    return null;
  }
};

export const analyzeSkillGap = async (
  role: string,
  currentSkills: string,
  businessGoal: string
): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `
              Role: ${role}
              Current Team Skills: ${currentSkills}
              Business Goal: ${businessGoal}
              
              Identify the skills gap and recommend 3 specific training interventions. 
              Keep it professional and concise.
            `,
        });
        return response.text || "Could not generate analysis.";
    } catch (error) {
        console.error("Error analyzing gap:", error);
        return "Error analyzing skills gap.";
    }
}
