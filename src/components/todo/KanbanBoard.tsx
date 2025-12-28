"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { Todo, TodoStatus } from "@/stores/todoStore";

interface KanbanBoardProps {
  todos: Todo[];
  onMoveTodo: (id: string, newStatus: TodoStatus) => void;
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
}

const columns: { id: TodoStatus; title: string }[] = [
  { id: "backlog", title: "Backlog" },
  { id: "in_progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

export function KanbanBoard({ todos, onMoveTodo, onUpdateTodo }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const column = columns.find((col) => col.id === overId);
    if (column) {
      onMoveTodo(activeId, column.id);
      return;
    }

    // Check if dropped on another card
    const overTodo = todos.find((t) => t.id === overId);
    if (overTodo) {
      onMoveTodo(activeId, overTodo.status);
    }
  };

  const activeTodo = todos.find((t) => t.id === activeId);

  const getTodosByStatus = (status: TodoStatus) =>
    todos.filter((t) => t.status === status).sort((a, b) => a.order - b.order);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            todos={getTodosByStatus(column.id)}
            onUpdateTodo={onUpdateTodo}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTodo && (
          <KanbanCard
            todo={activeTodo}
            onUpdate={() => {}}
            isDragging
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}

