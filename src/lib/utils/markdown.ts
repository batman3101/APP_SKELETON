import { DBProject, DBDocument, DBTodo } from "../db";

export function documentToMarkdown(document: DBDocument): string {
  const header = `# ${document.title}

---
Type: ${document.type.toUpperCase()}
Created: ${document.createdAt.toLocaleDateString("ko-KR")}
Updated: ${document.updatedAt.toLocaleDateString("ko-KR")}
---

`;

  return header + document.content;
}

export function projectToMarkdown(
  project: DBProject,
  documents: DBDocument[],
  todos: DBTodo[]
): string {
  let markdown = `# ${project.name}

${project.description}

---
앱 유형: ${project.appType}
진행률: ${project.progress}%
생성일: ${project.createdAt.toLocaleDateString("ko-KR")}
---

## 목차

`;

  // Table of contents
  documents.forEach((doc, index) => {
    markdown += `${index + 1}. [${doc.title}](#${doc.type})\n`;
  });
  markdown += `${documents.length + 1}. [TODO 현황](#todo-status)\n\n`;

  // Documents
  documents.forEach((doc) => {
    markdown += `---

## ${doc.title} {#${doc.type}}

${doc.content}

`;
  });

  // Todos
  markdown += `---

## TODO 현황 {#todo-status}

### 진행률: ${project.progress}%

`;

  const todosByStatus = {
    done: todos.filter((t) => t.status === "done"),
    in_progress: todos.filter((t) => t.status === "in_progress"),
    review: todos.filter((t) => t.status === "review"),
    backlog: todos.filter((t) => t.status === "backlog"),
  };

  if (todosByStatus.done.length > 0) {
    markdown += `### ✅ 완료 (${todosByStatus.done.length})\n\n`;
    todosByStatus.done.forEach((t) => {
      markdown += `- [x] ${t.title} (${t.category})\n`;
    });
    markdown += "\n";
  }

  if (todosByStatus.in_progress.length > 0) {
    markdown += `### 🔄 진행 중 (${todosByStatus.in_progress.length})\n\n`;
    todosByStatus.in_progress.forEach((t) => {
      markdown += `- [ ] ${t.title} (${t.category})\n`;
    });
    markdown += "\n";
  }

  if (todosByStatus.review.length > 0) {
    markdown += `### 👀 리뷰 (${todosByStatus.review.length})\n\n`;
    todosByStatus.review.forEach((t) => {
      markdown += `- [ ] ${t.title} (${t.category})\n`;
    });
    markdown += "\n";
  }

  if (todosByStatus.backlog.length > 0) {
    markdown += `### 📋 대기 (${todosByStatus.backlog.length})\n\n`;
    todosByStatus.backlog.forEach((t) => {
      markdown += `- [ ] ${t.title} (${t.category})\n`;
    });
    markdown += "\n";
  }

  return markdown;
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadAllDocuments(
  project: DBProject,
  documents: DBDocument[],
  todos: DBTodo[]
): void {
  const content = projectToMarkdown(project, documents, todos);
  const filename = `${project.name.replace(/\s+/g, "_")}_전체문서`;
  downloadMarkdown(content, filename);
}

