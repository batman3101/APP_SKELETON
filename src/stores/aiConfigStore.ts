"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AIProvider = "openai" | "claude" | "google";

export interface AIConfigState {
  aiProvider: AIProvider;
  aiModel: string;
  apiKey: string;
  isConfigured: boolean;
  setAIProvider: (provider: AIProvider) => void;
  setAIModel: (model: string) => void;
  setApiKey: (key: string) => void;
  setConfig: (provider: AIProvider, model: string, apiKey: string) => void;
  clearConfig: () => void;
}

export const useAIConfigStore = create<AIConfigState>()(
  persist(
    (set) => ({
      aiProvider: "google",
      aiModel: "gemini-1.5-flash",
      apiKey: "",
      isConfigured: false,
      
      setAIProvider: (provider) => 
        set((state) => ({ 
          aiProvider: provider,
          isConfigured: state.apiKey.length > 0,
        })),
      
      setAIModel: (model) =>
        set({ aiModel: model }),
      
      setApiKey: (key) => 
        set({ 
          apiKey: key,
          isConfigured: key.length > 0,
        }),
      
      setConfig: (provider, model, apiKey) =>
        set({
          aiProvider: provider,
          aiModel: model,
          apiKey: apiKey,
          isConfigured: apiKey.length > 0,
        }),
      
      clearConfig: () =>
        set({
          aiProvider: "google",
          aiModel: "gemini-1.5-flash",
          apiKey: "",
          isConfigured: false,
        }),
    }),
    {
      name: "vibe-coding-ai-config",
      // API 키는 민감 정보이므로 로컬에만 저장
      partialize: (state) => ({
        aiProvider: state.aiProvider,
        aiModel: state.aiModel,
        apiKey: state.apiKey,
        isConfigured: state.isConfigured,
      }),
    }
  )
);

