import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TodoStatus = "backlog" | "in_progress" | "review" | "done";
export type TodoPriority = "high" | "medium" | "low";
export type TodoCategory = string;

export interface Todo {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  category: TodoCategory;
  order: number;
  estimatedDays?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface TodoState {
  todos: Todo[];
  activeView: "kanban" | "checklist" | "timeline";
  
  // Actions
  addTodo: (todo: Omit<Todo, "id" | "order" | "createdAt" | "updatedAt">) => void;
  addTodos: (todos: Omit<Todo, "id" | "order" | "createdAt" | "updatedAt">[]) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  moveTodo: (id: string, newStatus: TodoStatus) => void;
  reorderTodos: (projectId: string, status: TodoStatus, todoIds: string[]) => void;
  setActiveView: (view: "kanban" | "checklist" | "timeline") => void;
  
  // Selectors
  getTodosByProject: (projectId: string) => Todo[];
  getTodosByStatus: (projectId: string, status: TodoStatus) => Todo[];
  getProgress: (projectId: string) => { completed: number; total: number; percentage: number };
}

const generateId = () => Math.random().toString(36).substring(2, 9);
const getTimestamp = () => new Date().toISOString();

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      activeView: "checklist",

      addTodo: (todoData) => {
        const { todos } = get();
        const projectTodos = todos.filter((t) => t.projectId === todoData.projectId);
        const maxOrder = projectTodos.reduce((max, t) => Math.max(max, t.order), 0);
        
        const timestamp = getTimestamp();
        const newTodo: Todo = {
          ...todoData,
          id: generateId(),
          order: maxOrder + 1,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set((state) => ({
          todos: [...state.todos, newTodo],
        }));
      },

      addTodos: (todosData) => {
        const { todos } = get();
        const timestamp = getTimestamp();
        
        const newTodos = todosData.map((todoData, index) => {
          const projectTodos = todos.filter((t) => t.projectId === todoData.projectId);
          const maxOrder = projectTodos.reduce((max, t) => Math.max(max, t.order), 0);
          
          return {
            ...todoData,
            id: generateId(),
            order: maxOrder + index + 1,
            createdAt: timestamp,
            updatedAt: timestamp,
          } as Todo;
        });
        
        set((state) => ({
          todos: [...state.todos, ...newTodos],
        }));
      },

      updateTodo: (id, updates) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...updates,
                  updatedAt: getTimestamp(),
                  completedAt:
                    updates.status === "done" && t.status !== "done"
                      ? getTimestamp()
                      : t.completedAt,
                }
              : t
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        })),

      moveTodo: (id, newStatus) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: newStatus,
                  updatedAt: getTimestamp(),
                  completedAt:
                    newStatus === "done" && t.status !== "done"
                      ? getTimestamp()
                      : newStatus !== "done"
                      ? undefined
                      : t.completedAt,
                }
              : t
          ),
        })),

      reorderTodos: (projectId, status, todoIds) =>
        set((state) => ({
          todos: state.todos.map((t) => {
            if (t.projectId === projectId && t.status === status) {
              const newOrder = todoIds.indexOf(t.id);
              if (newOrder !== -1) {
                return { ...t, order: newOrder };
              }
            }
            return t;
          }),
        })),

      setActiveView: (view) => set({ activeView: view }),

      getTodosByProject: (projectId) => {
        const { todos } = get();
        return todos
          .filter((t) => t.projectId === projectId)
          .sort((a, b) => a.order - b.order);
      },

      getTodosByStatus: (projectId, status) => {
        const { todos } = get();
        return todos
          .filter((t) => t.projectId === projectId && t.status === status)
          .sort((a, b) => a.order - b.order);
      },

      getProgress: (projectId) => {
        const { todos } = get();
        const projectTodos = todos.filter((t) => t.projectId === projectId);
        const completed = projectTodos.filter((t) => t.status === "done").length;
        const total = projectTodos.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { completed, total, percentage };
      },
    }),
    {
      name: "todo-storage",
    }
  )
);

