import { GoogleGenAI, Type } from "@google/genai";
import { AIPlanResponse, SurveyPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTrainingStrategy = async (
  topic: string,
  targetAudience: string,
  duration: string
): Promise<AIPlanResponse | null> => {
  try {
    const prompt = `
      Act as a Group Manager - Training utilizing the SFIA (Skills Framework for the Information Age) framework.
      Design a structured training program for: "${topic}".
      Target Audience: ${targetAudience}.
      Desired Duration: ${duration}.
      
      Return a JSON object with a catchy Title, a brief Overview, and a list of Modules.
      For each module:
      1. Provide a name.
      2. List 2-3 learning objectives.
      3. Estimated duration.
      4. Assign the target SFIA Level (1-7) for this module (e.g., "SFIA Level 3: Apply" or "SFIA Level 5: Ensure").
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
                  duration: { type: Type.STRING },
                  sfiaLevel: { type: Type.STRING, description: "The target SFIA Level (e.g., Level 4: Enable)" }
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
              
              Conduct a comprehensive Gap Analysis using the SFIA (Skills Framework for the Information Age) framework.
              1. Estimate the current SFIA Level of the team (1-7) based on the description.
              2. Determine the required SFIA Level to meet the Business Goal.
              3. Identify specific gaps in Autonomy, Influence, Complexity, and Business Skills.
              4. Recommend 3 specific training interventions to bridge this gap.
              
              Format the output clearly with bold headings.
            `,
        });
        return response.text || "Could not generate analysis.";
    } catch (error) {
        console.error("Error analyzing gap:", error);
        return "Error analyzing skills gap.";
    }
}

export const generateNeedsAssessmentSurvey = async (
  focusArea: string,
  respondentRole: string,
  intent: string
): Promise<SurveyPlan | null> => {
  try {
    const prompt = `
      Act as a Senior Organizational Development Consultant.
      Create a diagnostic questionnaire/survey to be sent to: ${respondentRole}.
      The focus area is: ${focusArea}.
      The strategic intent is: ${intent}.

      Generate 5-7 high-impact questions.
      Mix qualitative (text) and quantitative (scale 1-5) questions.
      
      For each question, provide a "rationale" explaining to the Group Manager why this question is critical for data collection.
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
                description: { type: Type.STRING },
                targetAudience: { type: Type.STRING },
                questions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            question: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ["scale", "text", "choice"] },
                            rationale: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                }
            }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as SurveyPlan;
  } catch (error) {
      console.error("Error generating survey:", error);
      return null;
  }
}