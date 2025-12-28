import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GoogleGenerateParams {
  apiKey: string;
  model?: string;
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

export function createGoogleAIClient(apiKey: string) {
  return new GoogleGenerativeAI(apiKey);
}

export async function generateDocumentWithGoogle(
  params: GoogleGenerateParams
): Promise<string> {
  const { 
    apiKey, 
    model = "gemini-1.5-flash", 
    systemPrompt, 
    userPrompt, 
    maxTokens = 4000 
  } = params;

  const genAI = new GoogleGenerativeAI(apiKey);
  const generativeModel = genAI.getGenerativeModel({ 
    model,
    systemInstruction: systemPrompt,
  });

  const result = await generativeModel.generateContent({
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.7,
    },
  });

  const response = result.response;
  return response.text();
}

