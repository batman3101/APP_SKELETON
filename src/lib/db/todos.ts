import { db, DBTodo, getTimestamp } from "./index";
import { updateProjectProgress } from "./projects";

// Todo operations
export async function addTodo(data: {
  projectUid: string;
  title: string;
  description?: string;
  priority: DBTodo["priority"];
  category: string;
  estimatedDays?: number;
}): Promise<number> {
  const now = getTimestamp();
  
  // Get max order for the project
  const existingTodos = await db.todos
    .where("projectUid")
    .equals(data.projectUid)
    .toArray();
  const maxOrder = existingTodos.reduce((max, t) => Math.max(max, t.order), 0);
  
  const id = await db.todos.add({
    projectUid: data.projectUid,
    title: data.title,
    description: data.description,
    status: "backlog",
    priority: data.priority,
    category: data.category,
    order: maxOrder + 1,
    estimatedDays: data.estimatedDays,
    createdAt: now,
    updatedAt: now,
  });
  
  await updateProjectProgress(data.projectUid);
  return id;
}

export async function addTodos(
  todos: Array<{
    projectUid: string;
    title: string;
    description?: string;
    priority: DBTodo["priority"];
    category: string;
    estimatedDays?: number;
  }>
): Promise<void> {
  if (todos.length === 0) return;
  
  const projectUid = todos[0].projectUid;
  const now = getTimestamp();
  
  const existingTodos = await db.todos
    .where("projectUid")
    .equals(projectUid)
    .toArray();
  const startOrder = existingTodos.reduce((max, t) => Math.max(max, t.order), 0);
  
  await db.todos.bulkAdd(
    todos.map((todo, index) => ({
      projectUid: todo.projectUid,
      title: todo.title,
      description: todo.description,
      status: "backlog" as const,
      priority: todo.priority,
      category: todo.category,
      order: startOrder + index + 1,
      estimatedDays: todo.estimatedDays,
      createdAt: now,
      updatedAt: now,
    }))
  );
  
  await updateProjectProgress(projectUid);
}

export async function getTodosByProject(projectUid: string): Promise<DBTodo[]> {
  return db.todos
    .where("projectUid")
    .equals(projectUid)
    .sortBy("order");
}

export async function updateTodo(
  id: number,
  updates: Partial<Pick<DBTodo, "title" | "description" | "priority" | "category" | "estimatedDays">>
): Promise<void> {
  const todo = await db.todos.get(id);
  if (!todo) return;
  
  await db.todos.update(id, {
    ...updates,
    updatedAt: getTimestamp(),
  });
}

export async function moveTodo(
  id: number,
  newStatus: DBTodo["status"]
): Promise<void> {
  const todo = await db.todos.get(id);
  if (!todo) return;
  
  const updates: Partial<DBTodo> = {
    status: newStatus,
    updatedAt: getTimestamp(),
  };
  
  if (newStatus === "done" && todo.status !== "done") {
    updates.completedAt = getTimestamp();
  } else if (newStatus !== "done") {
    updates.completedAt = undefined;
  }
  
  await db.todos.update(id, updates);
  await updateProjectProgress(todo.projectUid);
}

export async function deleteTodo(id: number): Promise<void> {
  const todo = await db.todos.get(id);
  if (!todo) return;
  
  await db.todos.delete(id);
  await updateProjectProgress(todo.projectUid);
}

export async function getProgress(projectUid: string): Promise<{
  completed: number;
  total: number;
  percentage: number;
}> {
  const todos = await db.todos.where("projectUid").equals(projectUid).toArray();
  const completed = todos.filter((t) => t.status === "done").length;
  const total = todos.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { completed, total, percentage };
}

