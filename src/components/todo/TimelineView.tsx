"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Todo } from "@/stores/todoStore";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineViewProps {
  todos: Todo[];
}

const priorityConfig = {
  high: { label: "높음", color: "bg-red-500/10 text-red-500 border-red-500" },
  medium: { label: "중간", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500" },
  low: { label: "낮음", color: "bg-green-500/10 text-green-500 border-green-500" },
};

export function TimelineView({ todos }: TimelineViewProps) {
  // Sort by priority and order
  const sortedTodos = [...todos].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.order - b.order;
  });

  // Calculate cumulative days for timeline
  let cumulativeDays = 0;
  const todosWithTimeline = sortedTodos.map((todo) => {
    const startDay = cumulativeDays;
    cumulativeDays += todo.estimatedDays || 1;
    return {
      ...todo,
      startDay,
      endDay: cumulativeDays,
    };
  });

  const totalDays = cumulativeDays;

  return (
    <Card>
      <CardHeader>
        <CardTitle>타임라인</CardTitle>
        <CardDescription>
          프로젝트 진행 일정을 시각화합니다 (예상 총 {totalDays}일)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {todosWithTimeline.map((todo, index) => {
              const priorityInfo = priorityConfig[todo.priority];
              const isDone = todo.status === "done";
              const isInProgress = todo.status === "in_progress";

              return (
                <div key={todo.id} className="relative flex items-start gap-4 pl-10">
                  {/* Timeline dot */}
                  <div className={cn(
                    "absolute left-2 w-5 h-5 rounded-full border-2 bg-background flex items-center justify-center",
                    isDone && "border-green-500",
                    isInProgress && "border-blue-500",
                    !isDone && !isInProgress && "border-muted-foreground"
                  )}>
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ) : isInProgress ? (
                      <Clock className="h-3 w-3 text-blue-500" />
                    ) : (
                      <Circle className="h-2.5 w-2.5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn(
                    "flex-1 pb-6 border-b last:border-b-0",
                    isDone && "opacity-60"
                  )}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">
                            Day {todo.startDay + 1} - {todo.endDay}
                          </span>
                          {isInProgress && (
                            <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-500">
                              진행 중
                            </Badge>
                          )}
                        </div>
                        <h4 className={cn(
                          "font-medium",
                          isDone && "line-through text-muted-foreground"
                        )}>
                          {todo.title}
                        </h4>
                        {todo.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {todo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {todo.category}
                          </Badge>
                          <Badge className={cn("text-xs", priorityInfo.color)}>
                            {priorityInfo.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-medium">
                          {todo.estimatedDays || 1}일
                        </span>
                      </div>
                    </div>

                    {/* Gantt-style bar */}
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          isDone && "bg-green-500",
                          isInProgress && "bg-blue-500",
                          !isDone && !isInProgress && "bg-muted-foreground/30"
                        )}
                        style={{
                          width: isDone ? "100%" : isInProgress ? "50%" : "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-500">
                {todos.filter((t) => t.status === "done").length}
              </p>
              <p className="text-xs text-muted-foreground">완료</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">
                {todos.filter((t) => t.status === "in_progress").length}
              </p>
              <p className="text-xs text-muted-foreground">진행 중</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-muted-foreground">
                {todos.filter((t) => t.status === "backlog" || t.status === "review").length}
              </p>
              <p className="text-xs text-muted-foreground">대기</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

