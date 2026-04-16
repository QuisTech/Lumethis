import { GoogleGenAI, Type } from "@google/genai";
import { AIPlanResponse, SurveyPlan } from "../types";

const getAIClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY is missing from environment variables");
    throw new Error("API Configuration Error: Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTrainingStrategy = async (
  topic: string,
  targetAudience: string,
  duration: string
): Promise<AIPlanResponse | null> => {
  try {
    const ai = getAIClient();
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
      model: "gemini-2.0-flash",
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
                },
                required: ["name", "objectives", "duration"]
              }
            }
          },
          required: ["title", "overview", "modules"]
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
        const ai = getAIClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
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
        return "Error analyzing skills gap. Please check your API Key configuration.";
    }
}

export const generateNeedsAssessmentSurvey = async (
  focusArea: string,
  respondentRole: string,
  intent: string
): Promise<SurveyPlan | null> => {
  try {
    const ai = getAIClient();
    const prompt = `
      Act as a Senior Organizational Development Consultant.
      Create a diagnostic questionnaire/survey to be sent to: ${respondentRole}.
      The focus area is: ${focusArea}.
      The strategic intent is: ${intent}.

      Generate 5-7 high-impact questions.
      
      CRITICAL: Return JSON matching this structure exactly.
      questions array items must have:
      - question: string
      - type: string (MUST be exactly "scale", "text", or "choice")
      - rationale: string
      - options: array of strings (ONLY if type is "choice")
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
                            question: { type: Type.STRING },
                            type: { 
                                type: Type.STRING, 
                                description: "One of: scale, text, choice" 
                            },
                            rationale: { type: Type.STRING },
                            options: { 
                                type: Type.ARRAY, 
                                items: { type: Type.STRING },
                                description: "Required only if type is choice"
                            }
                        },
                        required: ["question", "type", "rationale"]
                    }
                }
            },
            required: ["title", "description", "targetAudience", "questions"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as SurveyPlan;
  } catch (error) {
      console.error("Error generating survey:", error);
      throw error; 
  }
}

export const robustifyReport = async (
  shallowReport: string,
  context: string
): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
        Act as a Senior Operations Manager at EIB Group. 
        The following daily work report is considered "too shallow" by management.
        Your task is to expand and "robustify" this report into a professional, detailed, and analytical document.
        
        Shallow Report Content: "${shallowReport}"
        Context (Role/Subsidiary): ${context}
        
        Guidelines:
        1. Use professional, operational language (e.g., "operational tempo", "situational awareness", "strategic alignment").
        2. Break down the tasks into specific, measurable actions.
        3. Add analytical insights (e.g., why this task matters, what the impact is).
        4. Ensure it sounds like it came from a high-performing employee at a strategic firm like EIB STRATOC.
        
        Return ONLY the expanded text for the "Completed Tasks" or "Overall Situation" section.
      `,
    });
    return response.text || shallowReport;
  } catch (error) {
    console.error("Error robustifying report:", error);
    return shallowReport;
  }
};