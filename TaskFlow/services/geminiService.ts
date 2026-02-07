import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

// Initialize Gemini Client
// The API key must be obtained exclusively from the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const breakdownTaskWithAI = async (taskText: string): Promise<string[]> => {
  try {
    const model = "gemini-3-flash-preview"; 
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `Break down the following task into 3-5 smaller, actionable sub-tasks. Return ONLY the sub-tasks as a JSON array of strings. Task: "${taskText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    if (response.text) {
      const subtasks = JSON.parse(response.text);
      return Array.isArray(subtasks) ? subtasks : [];
    }
    return [];

  } catch (error) {
    console.error("Error breaking down task with Gemini:", error);
    throw new Error("Failed to generate subtasks. Please try again.");
  }
};

export const smartFilterTasks = async (query: string, tasks: Task[]): Promise<string[]> => {
  if (tasks.length === 0) return [];

  try {
    const taskListString = tasks.map(t => JSON.stringify({ id: t.id, text: t.text, priority: t.priority, tags: t.tags })).join('\n');
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a smart filter assistant.
      User Query: "${query}"
      
      Below is a list of tasks. Return a JSON Array containing ONLY the 'id' strings of the tasks that are relevant to the User Query.
      If the query implies high priority, check priority fields. If it implies certain topics, check text and tags.
      
      Tasks:
      ${taskListString}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    if (response.text) {
      const ids = JSON.parse(response.text);
      return Array.isArray(ids) ? ids : [];
    }
    return [];
  } catch (error) {
    console.error("Smart filter failed", error);
    return [];
  }
}