import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Document {
  id: string;
  type: "planning" | "prd" | "trd" | "tdd" | "todo";
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdditionalFeature {
  id: string;
  name: string;
  description: string;
  documents: Document[];
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  appType: string;
  documents: Document[];
  additionalFeatures: AdditionalFeature[];
  progress: number;
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
  
  // Actions
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
  addDocument: (projectId: string, document: Omit<Document, "id" | "createdAt" | "updatedAt">) => void;
  updateDocument: (projectId: string, documentId: string, updates: Partial<Document>) => void;
  addAdditionalFeature: (projectId: string, feature: Omit<AdditionalFeature, "id" | "createdAt">) => void;
  
  // Selectors
  getCurrentProject: () => Project | null;
  getProjectById: (id: string) => Project | null;
}

const generateId = () => Math.random().toString(36).substring(2, 9);
const getTimestamp = () => new Date().toISOString();

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,

      addProject: (projectData) => {
        const id = generateId();
        const timestamp = getTimestamp();
        const newProject: Project = {
          ...projectData,
          id,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set((state) => ({
          projects: [...state.projects, newProject],
          currentProjectId: id,
        }));
        return id;
      },

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: getTimestamp() } : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProjectId:
            state.currentProjectId === id ? null : state.currentProjectId,
        })),

      setCurrentProject: (id) => set({ currentProjectId: id }),

      addDocument: (projectId, documentData) => {
        const id = generateId();
        const timestamp = getTimestamp();
        const newDocument: Document = {
          ...documentData,
          id,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  documents: [...p.documents, newDocument],
                  updatedAt: timestamp,
                }
              : p
          ),
        }));
      },

      updateDocument: (projectId, documentId, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  documents: p.documents.map((d) =>
                    d.id === documentId
                      ? { ...d, ...updates, updatedAt: getTimestamp() }
                      : d
                  ),
                  updatedAt: getTimestamp(),
                }
              : p
          ),
        })),

      addAdditionalFeature: (projectId, featureData) => {
        const id = generateId();
        const timestamp = getTimestamp();
        const newFeature: AdditionalFeature = {
          ...featureData,
          id,
          createdAt: timestamp,
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  additionalFeatures: [...p.additionalFeatures, newFeature],
                  updatedAt: timestamp,
                }
              : p
          ),
        }));
      },

      getCurrentProject: () => {
        const { projects, currentProjectId } = get();
        return projects.find((p) => p.id === currentProjectId) || null;
      },

      getProjectById: (id) => {
        const { projects } = get();
        return projects.find((p) => p.id === id) || null;
      },
    }),
    {
      name: "project-storage",
    }
  )
);

