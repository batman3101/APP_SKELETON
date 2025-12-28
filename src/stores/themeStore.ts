import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ColorInfo {
  hex: string;
  name: string;
  usage: string;
}

export interface TypographyInfo {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  usage: string;
}

export interface ThemeCaptureResult {
  id: string;
  sourceType: "screenshot" | "url";
  sourceUrl?: string;
  colors: ColorInfo[];
  typography: TypographyInfo[];
  cssCode: string;
  tailwindConfig: string;
  aiPrompt: string;
  createdAt: string;
}

interface ThemeState {
  captureMode: "screenshot" | "url";
  isAnalyzing: boolean;
  currentResult: ThemeCaptureResult | null;
  savedResults: ThemeCaptureResult[];
  
  // Actions
  setCaptureMode: (mode: "screenshot" | "url") => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setCurrentResult: (result: ThemeCaptureResult | null) => void;
  saveResult: (result: ThemeCaptureResult) => void;
  deleteResult: (id: string) => void;
  clearCurrentResult: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      captureMode: "screenshot",
      isAnalyzing: false,
      currentResult: null,
      savedResults: [],

      setCaptureMode: (mode) => set({ captureMode: mode }),

      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

      setCurrentResult: (result) => set({ currentResult: result }),

      saveResult: (result) =>
        set((state) => ({
          savedResults: [
            ...state.savedResults,
            { ...result, id: result.id || generateId() },
          ],
        })),

      deleteResult: (id) =>
        set((state) => ({
          savedResults: state.savedResults.filter((r) => r.id !== id),
        })),

      clearCurrentResult: () => set({ currentResult: null }),
    }),
    {
      name: "theme-storage",
    }
  )
);

