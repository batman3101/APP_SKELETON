"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AIProvider = "openai" | "claude" | "google";

export interface AIConfigState {
  aiProvider: AIProvider;
  apiKey: string;
  isConfigured: boolean;
  setAIProvider: (provider: AIProvider) => void;
  setApiKey: (key: string) => void;
  setConfig: (provider: AIProvider, apiKey: string) => void;
  clearConfig: () => void;
}

export const useAIConfigStore = create<AIConfigState>()(
  persist(
    (set) => ({
      aiProvider: "openai",
      apiKey: "",
      isConfigured: false,
      
      setAIProvider: (provider) => 
        set((state) => ({ 
          aiProvider: provider,
          isConfigured: state.apiKey.length > 0,
        })),
      
      setApiKey: (key) => 
        set((state) => ({ 
          apiKey: key,
          isConfigured: key.length > 0,
        })),
      
      setConfig: (provider, apiKey) =>
        set({
          aiProvider: provider,
          apiKey: apiKey,
          isConfigured: apiKey.length > 0,
        }),
      
      clearConfig: () =>
        set({
          aiProvider: "openai",
          apiKey: "",
          isConfigured: false,
        }),
    }),
    {
      name: "vibe-coding-ai-config",
      // API 키는 민감 정보이므로 로컬에만 저장
      partialize: (state) => ({
        aiProvider: state.aiProvider,
        apiKey: state.apiKey,
        isConfigured: state.isConfigured,
      }),
    }
  )
);

