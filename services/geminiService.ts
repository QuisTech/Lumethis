import { GoogleGenAI, Type } from "@google/genai";
import { AIPlanResponse, SurveyPlan } from "../types";

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  console.log("Checking API Key availability...");
  if (!apiKey) {
    console.error("GEMINI_API_KEY and API_KEY are both missing or empty in environment variables.");
    throw new Error("API Configuration Error: Key not found");
  }
  console.log("API Key found (length: " + apiKey.length + ")");
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
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
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
    if (!text) {
      const finishReason = response.candidates?.[0]?.finishReason;
      const safetyRatings = response.candidates?.[0]?.safetyRatings;
      console.warn(`Gemini returned empty text. Finish reason: ${finishReason}. Safety ratings: ${JSON.stringify(safetyRatings)}. Full response:`, JSON.stringify(response, null, 2));
      return null;
    }
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
        const prompt = `
              Role: ${role}
              Current Team Skills: ${currentSkills}
              Business Goal: ${businessGoal}
              
              Conduct a comprehensive Gap Analysis using the SFIA (Skills Framework for the Information Age) framework.
              1. Estimate the current SFIA Level of the team (1-7) based on the description.
              2. Determine the required SFIA Level to meet the Business Goal.
              3. Identify specific gaps in Autonomy, Influence, Complexity, and Business Skills.
              4. Recommend 3 specific training interventions to bridge this gap.
              
              Format the output clearly with bold headings.
            `;
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ parts: [{ text: prompt }] }],
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
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
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
    if (!text) {
      const finishReason = response.candidates?.[0]?.finishReason;
      const safetyRatings = response.candidates?.[0]?.safetyRatings;
      console.warn(`Gemini returned empty text for survey. Finish reason: ${finishReason}. Safety ratings: ${JSON.stringify(safetyRatings)}. Full response:`, JSON.stringify(response, null, 2));
      return null;
    }
    return JSON.parse(text) as SurveyPlan;
  } catch (error) {
      console.error("Error generating survey:", error);
      throw error; 
  }
}

export const generateKPIs = async (
  level: string,
  entityName: string,
  strategicFocus: string
): Promise<import("../types").KPIPlan | null> => {
  try {
    const ai = getAIClient();
    const prompt = `
      Act as a Chief Strategy Officer.
      Develop a set of Key Performance Indicators (KPIs) and Goals for:
      Level: ${level} (e.g., Individual Staff, Unit, Manager, Subsidiary)
      Entity Name: ${entityName}
      Strategic Focus: ${strategicFocus}

      Generate 5-7 specific, measurable, achievable, relevant, and time-bound (SMART) KPIs.

      Return a JSON object with:
      - title: A professional title for this KPI set.
      - level: The level provided.
      - strategicFocus: The focus provided.
      - kpis: An array of objects, each containing:
        - area: The business area (e.g., Financial, Operational, Customer).
        - kpi: The specific indicator name.
        - target: A suggested quantitative target.
        - measurementFrequency: How often to measure (e.g., Monthly, Quarterly).
        - owner: Who is responsible (role title).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            level: { type: Type.STRING },
            strategicFocus: { type: Type.STRING },
            kpis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  area: { type: Type.STRING },
                  kpi: { type: Type.STRING },
                  target: { type: Type.STRING },
                  measurementFrequency: { type: Type.STRING },
                  owner: { type: Type.STRING }
                },
                required: ["area", "kpi", "target", "measurementFrequency", "owner"]
              }
            }
          },
          required: ["title", "level", "strategicFocus", "kpis"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      const finishReason = response.candidates?.[0]?.finishReason;
      const safetyRatings = response.candidates?.[0]?.safetyRatings;
      console.warn(`Gemini returned empty text for KPIs. Finish reason: ${finishReason}. Safety ratings: ${JSON.stringify(safetyRatings)}. Full response:`, JSON.stringify(response, null, 2));
      return null;
    }
    return JSON.parse(text) as import("../types").KPIPlan;

  } catch (error) {
    console.error("Error generating KPIs:", error);
    return null;
  }
};

export const generatePDP = async (
  role: string,
  careerGoal: string,
  timeframe: string
): Promise<import("../types").PDPPlan | null> => {
  try {
    const ai = getAIClient();
    const prompt = `
      Act as a Talent Development Manager.
      Create a Personal Development Plan (PDP) and Continuing Professional Development (CPD) guide for:
      Current Role: ${role}
      Career Goal: ${careerGoal}
      Timeframe: ${timeframe}

      Return a JSON object with:
      - employeeName: "Placeholder Name"
      - currentRole: The role provided.
      - careerGoal: The goal provided.
      - strengths: 3 potential key strengths required for this transition.
      - developmentAreas: 3 key areas to develop.
      - actionPlan: An array of 4-5 specific development actions. Each must have:
        - category: One of "Formal Training", "Experience/Project", "Mentoring/Coaching", "Self-Study".
        - action: Specific activity description.
        - timeline: When to complete within the ${timeframe}.
        - successCriteria: How to measure completion.
      - cpdRecommendations: List of 3-4 specific topics or certifications to focus CPD hours on.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            employeeName: { type: Type.STRING },
            currentRole: { type: Type.STRING },
            careerGoal: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            developmentAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  action: { type: Type.STRING },
                  timeline: { type: Type.STRING },
                  successCriteria: { type: Type.STRING }
                },
                required: ["category", "action", "timeline", "successCriteria"]
              }
            },
            cpdRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["currentRole", "careerGoal", "strengths", "developmentAreas", "actionPlan", "cpdRecommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      const finishReason = response.candidates?.[0]?.finishReason;
      const safetyRatings = response.candidates?.[0]?.safetyRatings;
      console.warn(`Gemini returned empty text for PDP. Finish reason: ${finishReason}. Safety ratings: ${JSON.stringify(safetyRatings)}. Full response:`, JSON.stringify(response, null, 2));
      return null;
    }
    return JSON.parse(text) as import("../types").PDPPlan;

  } catch (error) {
    console.error("Error generating PDP:", error);
    return null;
  }
};

export const generateTeachingNotes = async (
  sourceContent: string,
  sourceType: string
): Promise<import("../types").TeachingNotes | null> => {
  try {
    const ai = getAIClient();
    const prompt = `
      Act as a professional trainer.
      Based on the following ${sourceType} report:
      """
      ${sourceContent}
      """
      Generate structured teaching notes that can be used to teach this material to others.
      
      Return a JSON object with:
      - title: A catchy title for the teaching session.
      - introduction: A brief introduction to the topic.
      - keyConcepts: An array of 3-5 key concepts to cover.
      - discussionQuestions: An array of 3-5 discussion questions for the audience.
      - summary: A brief summary of the teaching session.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            introduction: { type: Type.STRING },
            keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            discussionQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ["title", "introduction", "keyConcepts", "discussionQuestions", "summary"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      const finishReason = response.candidates?.[0]?.finishReason;
      const safetyRatings = response.candidates?.[0]?.safetyRatings;
      console.warn(`Gemini returned empty text for Teaching Notes. Finish reason: ${finishReason}. Safety ratings: ${JSON.stringify(safetyRatings)}. Full response:`, JSON.stringify(response, null, 2));
      return null;
    }
    return JSON.parse(text) as import("../types").TeachingNotes;
  } catch (error) {
    console.error("Error generating Teaching Notes:", error);
    return null;
  }
};
