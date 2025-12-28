"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KanbanCard } from "./KanbanCard";
import { Todo, TodoStatus } from "@/stores/todoStore";
import { Circle, Clock, Eye, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: TodoStatus;
  title: string;
  todos: Todo[];
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
}

const statusConfig: Record<TodoStatus, { icon: typeof Circle; color: string; bgColor: string }> = {
  backlog: { icon: Circle, color: "text-muted-foreground", bgColor: "bg-muted/50" },
  in_progress: { icon: Clock, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  review: { icon: Eye, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  done: { icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500/10" },
};

export function KanbanColumn({ id, title, todos, onUpdateTodo }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = statusConfig[id];
  const Icon = config.icon;

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "min-h-[400px] transition-colors",
        isOver && "ring-2 ring-primary border-primary"
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-4 w-4", config.color)} />
            {title}
          </div>
          <Badge variant="secondary" className="ml-auto">
            {todos.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <SortableContext
          items={todos.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {todos.map((todo) => (
            <KanbanCard
              key={todo.id}
              todo={todo}
              onUpdate={(updates) => onUpdateTodo(todo.id, updates)}
            />
          ))}
        </SortableContext>
        {todos.length === 0 && (
          <div className={cn(
            "flex items-center justify-center h-20 rounded-lg border-2 border-dashed",
            config.bgColor
          )}>
            <p className="text-sm text-muted-foreground">
              항목을 여기에 드롭하세요
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

