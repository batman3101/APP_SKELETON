import { db, DBProject, DBDocument, generateUid, getTimestamp } from "./index";

// Project operations
export async function createProject(data: {
  name: string;
  description: string;
  appType: string;
}): Promise<string> {
  const uid = generateUid();
  const now = getTimestamp();
  
  await db.projects.add({
    uid,
    name: data.name,
    description: data.description,
    appType: data.appType,
    progress: 0,
    createdAt: now,
    updatedAt: now,
  });
  
  return uid;
}

export async function getProjects(): Promise<DBProject[]> {
  return db.projects.orderBy("createdAt").reverse().toArray();
}

export async function getProjectByUid(uid: string): Promise<DBProject | undefined> {
  return db.projects.where("uid").equals(uid).first();
}

export async function updateProject(
  uid: string,
  updates: Partial<Pick<DBProject, "name" | "description" | "progress">>
): Promise<void> {
  await db.projects
    .where("uid")
    .equals(uid)
    .modify({ ...updates, updatedAt: getTimestamp() });
}

export async function deleteProject(uid: string): Promise<void> {
  await db.transaction("rw", [db.projects, db.documents, db.todos], async () => {
    await db.projects.where("uid").equals(uid).delete();
    await db.documents.where("projectUid").equals(uid).delete();
    await db.todos.where("projectUid").equals(uid).delete();
  });
}

// Document operations
export async function addDocument(data: {
  projectUid: string;
  type: DBDocument["type"];
  title: string;
  content: string;
}): Promise<number> {
  const now = getTimestamp();
  
  return db.documents.add({
    projectUid: data.projectUid,
    type: data.type,
    title: data.title,
    content: data.content,
    createdAt: now,
    updatedAt: now,
  });
}

export async function getDocumentsByProject(projectUid: string): Promise<DBDocument[]> {
  return db.documents.where("projectUid").equals(projectUid).toArray();
}

export async function updateDocument(id: number, content: string): Promise<void> {
  await db.documents.update(id, {
    content,
    updatedAt: getTimestamp(),
  });
}

export async function deleteDocument(id: number): Promise<void> {
  await db.documents.delete(id);
}

// Calculate project progress based on todos
export async function updateProjectProgress(projectUid: string): Promise<void> {
  const todos = await db.todos.where("projectUid").equals(projectUid).toArray();
  
  if (todos.length === 0) {
    await updateProject(projectUid, { progress: 0 });
    return;
  }
  
  const completed = todos.filter((t) => t.status === "done").length;
  const progress = Math.round((completed / todos.length) * 100);
  
  await updateProject(projectUid, { progress });
}

