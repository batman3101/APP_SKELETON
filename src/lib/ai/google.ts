import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GoogleGenerateParams {
  apiKey: string;
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
  const { apiKey, systemPrompt, userPrompt, maxTokens = 4000 } = params;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro",
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.7,
    },
  });

  const response = result.response;
  return response.text();
}

