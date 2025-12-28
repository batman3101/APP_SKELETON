import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IdeaData {
  name: string;
  shortDescription: string;
  detailedDescription: string;
}

export interface FeaturesData {
  coreFeatures: string[];
  targetUsers: string;
  referenceApps: string;
}

export interface AIConfigData {
  aiProvider: "openai" | "claude";
  apiKey: string;
  userLevel: "beginner" | "intermediate" | "advanced";
  documentsToGenerate: string[];
}

export interface WizardData {
  appType: string;
  idea: IdeaData;
  features: FeaturesData;
  aiConfig: AIConfigData;
}

interface WizardState {
  currentStep: number;
  data: WizardData;
  isGenerating: boolean;
  generatedDocuments: string[];
  
  // Actions
  setCurrentStep: (step: number) => void;
  setAppType: (appType: string) => void;
  setIdea: (idea: IdeaData) => void;
  setFeatures: (features: FeaturesData) => void;
  setAIConfig: (config: AIConfigData) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  addGeneratedDocument: (docId: string) => void;
  reset: () => void;
  
  // Validation
  canProceed: () => boolean;
}

const initialData: WizardData = {
  appType: "",
  idea: {
    name: "",
    shortDescription: "",
    detailedDescription: "",
  },
  features: {
    coreFeatures: [],
    targetUsers: "",
    referenceApps: "",
  },
  aiConfig: {
    aiProvider: "openai",
    apiKey: "",
    userLevel: "beginner",
    documentsToGenerate: ["planning", "prd", "trd", "tdd", "todo"],
  },
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      data: initialData,
      isGenerating: false,
      generatedDocuments: [],

      setCurrentStep: (step) => set({ currentStep: step }),

      setAppType: (appType) =>
        set((state) => ({
          data: { ...state.data, appType },
        })),

      setIdea: (idea) =>
        set((state) => ({
          data: { ...state.data, idea },
        })),

      setFeatures: (features) =>
        set((state) => ({
          data: { ...state.data, features },
        })),

      setAIConfig: (aiConfig) =>
        set((state) => ({
          data: { ...state.data, aiConfig },
        })),

      setIsGenerating: (isGenerating) => set({ isGenerating }),

      addGeneratedDocument: (docId) =>
        set((state) => ({
          generatedDocuments: [...state.generatedDocuments, docId],
        })),

      reset: () =>
        set({
          currentStep: 1,
          data: initialData,
          isGenerating: false,
          generatedDocuments: [],
        }),

      canProceed: () => {
        const { currentStep, data, generatedDocuments } = get();
        switch (currentStep) {
          case 1:
            return !!data.appType;
          case 2:
            return !!(
              data.idea.name &&
              data.idea.shortDescription &&
              data.idea.detailedDescription
            );
          case 3:
            return data.features.coreFeatures.length >= 1;
          case 4:
            return !!(
              data.aiConfig.apiKey &&
              data.aiConfig.documentsToGenerate.length > 0
            );
          case 5:
            return (
              generatedDocuments.length === data.aiConfig.documentsToGenerate.length
            );
          default:
            return false;
        }
      },
    }),
    {
      name: "wizard-storage",
      partialize: (state) => ({
        data: {
          ...state.data,
          aiConfig: {
            ...state.data.aiConfig,
            apiKey: "", // Don't persist API key for security
          },
        },
      }),
    }
  )
);

