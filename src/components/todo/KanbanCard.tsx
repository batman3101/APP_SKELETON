"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Todo } from "@/stores/todoStore";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  todo: Todo;
  onUpdate: (updates: Partial<Todo>) => void;
  isDragging?: boolean;
}

const priorityConfig = {
  high: { label: "높음", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  medium: { label: "중간", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  low: { label: "낮음", color: "bg-green-500/10 text-green-500 border-green-500/20" },
};

export function KanbanCard({ todo, isDragging }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityInfo = priorityConfig[todo.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-3 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing",
        (isDragging || isSortableDragging) && "opacity-50 shadow-lg",
        todo.status === "done" && "bg-muted/30"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-medium text-sm mb-2",
            todo.status === "done" && "line-through text-muted-foreground"
          )}>
            {todo.title}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {todo.category}
            </Badge>
            <Badge className={cn("text-xs border", priorityInfo.color)}>
              {priorityInfo.label}
            </Badge>
            {todo.estimatedDays && (
              <span className="text-xs text-muted-foreground">
                {todo.estimatedDays}일
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

