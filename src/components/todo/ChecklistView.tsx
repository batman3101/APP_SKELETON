"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Todo, TodoStatus } from "@/stores/todoStore";
import { cn } from "@/lib/utils";

interface ChecklistViewProps {
  todos: Todo[];
  onToggleTodo: (id: string, newStatus: TodoStatus) => void;
  progress: { completed: number; total: number; percentage: number };
}

const priorityConfig = {
  high: { label: "높음", color: "bg-red-500/10 text-red-500" },
  medium: { label: "중간", color: "bg-yellow-500/10 text-yellow-500" },
  low: { label: "낮음", color: "bg-green-500/10 text-green-500" },
};

export function ChecklistView({ todos, onToggleTodo, progress }: ChecklistViewProps) {
  // Group todos by category
  const categories = [...new Set(todos.map((t) => t.category))];
  const todosByCategory = categories.reduce((acc, category) => {
    acc[category] = todos.filter((t) => t.category === category);
    return acc;
  }, {} as Record<string, Todo[]>);

  const handleToggle = (todo: Todo) => {
    const newStatus: TodoStatus = todo.status === "done" ? "backlog" : "done";
    onToggleTodo(todo.id, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">전체 진행률</h3>
              <p className="text-sm text-muted-foreground">
                {progress.completed} / {progress.total} 완료
              </p>
            </div>
            <span className="text-3xl font-bold text-primary">
              {progress.percentage}%
            </span>
          </div>
          <Progress value={progress.percentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Checklist by Category */}
      {categories.map((category) => {
        const categoryTodos = todosByCategory[category];
        const categoryCompleted = categoryTodos.filter((t) => t.status === "done").length;
        const categoryProgress = Math.round((categoryCompleted / categoryTodos.length) * 100);

        return (
          <Card key={category}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{category}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {categoryCompleted}/{categoryTodos.length}
                  </span>
                  <Badge variant="secondary">{categoryProgress}%</Badge>
                </div>
              </div>
              <Progress value={categoryProgress} className="h-1.5" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryTodos.map((todo) => {
                  const priorityInfo = priorityConfig[todo.priority];
                  const isCompleted = todo.status === "done";

                  return (
                    <div
                      key={todo.id}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-lg border transition-colors",
                        isCompleted ? "bg-muted/30" : "hover:bg-muted/50"
                      )}
                    >
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => handleToggle(todo)}
                        className="shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium",
                          isCompleted && "line-through text-muted-foreground"
                        )}>
                          {todo.title}
                        </p>
                        {todo.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {todo.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className={cn("text-xs", priorityInfo.color)}>
                          {priorityInfo.label}
                        </Badge>
                        {todo.estimatedDays && (
                          <span className="text-xs text-muted-foreground">
                            {todo.estimatedDays}일
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

