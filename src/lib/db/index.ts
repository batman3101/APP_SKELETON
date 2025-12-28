import Dexie, { Table } from "dexie";

// Types
export interface DBProject {
  id?: number;
  uid: string;
  name: string;
  description: string;
  appType: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBDocument {
  id?: number;
  projectUid: string;
  type: "planning" | "prd" | "trd" | "tdd" | "todo";
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBTodo {
  id?: number;
  projectUid: string;
  title: string;
  description?: string;
  status: "backlog" | "in_progress" | "review" | "done";
  priority: "high" | "medium" | "low";
  category: string;
  order: number;
  estimatedDays?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface DBThemeCapture {
  id?: number;
  sourceType: "screenshot" | "url";
  sourceUrl?: string;
  colors: Array<{ hex: string; name: string; usage: string }>;
  fonts: Array<{ fontFamily: string; usage: string }>;
  tailwindConfig: string;
  cssVariables: string;
  aiPrompt: string;
  createdAt: Date;
}

export interface DBAdditionalFeature {
  id?: number;
  projectUid: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface DBFeatureDocument {
  id?: number;
  featureId: number;
  type: "prd" | "trd" | "tdd";
  content: string;
  createdAt: Date;
}

// Database class
class VibeCodingDB extends Dexie {
  projects!: Table<DBProject>;
  documents!: Table<DBDocument>;
  todos!: Table<DBTodo>;
  themeCaptures!: Table<DBThemeCapture>;
  additionalFeatures!: Table<DBAdditionalFeature>;
  featureDocuments!: Table<DBFeatureDocument>;

  constructor() {
    super("VibeCodingDB");
    
    this.version(1).stores({
      projects: "++id, uid, name, createdAt",
      documents: "++id, projectUid, type, createdAt",
      todos: "++id, projectUid, status, priority, order",
      themeCaptures: "++id, sourceType, createdAt",
      additionalFeatures: "++id, projectUid, createdAt",
      featureDocuments: "++id, featureId, type",
    });
  }
}

export const db = new VibeCodingDB();

// Helper functions
export const generateUid = () => Math.random().toString(36).substring(2, 11);

export const getTimestamp = () => new Date();

