"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  LayoutGrid, 
  List, 
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock
} from "lucide-react";

// 임시 TODO 데이터
const todoData = {
  projectName: "쇼핑몰 앱",
  totalCount: 12,
  completedCount: 4,
  todos: [
    { id: "1", title: "프로젝트 초기 설정", status: "done", priority: "high", category: "설정" },
    { id: "2", title: "기본 레이아웃 구현", status: "done", priority: "high", category: "UI" },
    { id: "3", title: "상품 목록 페이지", status: "done", priority: "high", category: "기능" },
    { id: "4", title: "상품 상세 페이지", status: "done", priority: "high", category: "기능" },
    { id: "5", title: "장바구니 기능", status: "in_progress", priority: "high", category: "기능" },
    { id: "6", title: "결제 시스템 연동", status: "todo", priority: "high", category: "기능" },
    { id: "7", title: "주문 내역 페이지", status: "todo", priority: "medium", category: "기능" },
    { id: "8", title: "사용자 인증", status: "todo", priority: "medium", category: "인증" },
    { id: "9", title: "마이페이지", status: "todo", priority: "medium", category: "기능" },
    { id: "10", title: "반응형 디자인", status: "todo", priority: "low", category: "UI" },
    { id: "11", title: "테스트 코드 작성", status: "todo", priority: "medium", category: "테스트" },
    { id: "12", title: "배포", status: "todo", priority: "low", category: "배포" },
  ],
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "done":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "in_progress":
      return <Clock className="h-4 w-4 text-blue-500" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500/10 text-red-500";
    case "medium":
      return "bg-yellow-500/10 text-yellow-500";
    default:
      return "bg-green-500/10 text-green-500";
  }
};

export default function TodoPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const [activeView, setActiveView] = useState("checklist");
  const progress = (todoData.completedCount / todoData.totalCount) * 100;

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link href={`/project/${id}`}>
              <Button variant="ghost" className="gap-2 mb-2 -ml-4">
                <ArrowLeft className="h-4 w-4" />
                프로젝트로 돌아가기
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">TODO 관리</h1>
            <p className="text-muted-foreground">{todoData.projectName}</p>
          </div>
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI 진행도 분석
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">전체 진행률</h3>
                <p className="text-sm text-muted-foreground">
                  {todoData.completedCount} / {todoData.totalCount} 완료
                </p>
              </div>
              <span className="text-3xl font-bold text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* View Tabs */}
        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
          <TabsList>
            <TabsTrigger value="checklist" className="gap-2">
              <List className="h-4 w-4" />
              체크리스트
            </TabsTrigger>
            <TabsTrigger value="kanban" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              칸반 보드
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <Calendar className="h-4 w-4" />
              타임라인
            </TabsTrigger>
          </TabsList>

          {/* Checklist View */}
          <TabsContent value="checklist">
            <Card>
              <CardHeader>
                <CardTitle>체크리스트</CardTitle>
                <CardDescription>
                  TODO 항목을 체크하며 진행하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todoData.todos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                        todo.status === "done" ? "bg-muted/30" : "hover:bg-muted/50"
                      }`}
                    >
                      <button className="shrink-0">
                        {getStatusIcon(todo.status)}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${
                          todo.status === "done" ? "line-through text-muted-foreground" : ""
                        }`}>
                          {todo.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {todo.category}
                          </Badge>
                          <Badge className={`text-xs ${getPriorityColor(todo.priority)}`}>
                            {todo.priority === "high" ? "높음" : 
                             todo.priority === "medium" ? "중간" : "낮음"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kanban View */}
          <TabsContent value="kanban">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Backlog */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Circle className="h-4 w-4 text-muted-foreground" />
                    Backlog
                    <Badge variant="secondary" className="ml-auto">
                      {todoData.todos.filter(t => t.status === "todo").length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todoData.todos
                    .filter((t) => t.status === "todo")
                    .map((todo) => (
                      <div
                        key={todo.id}
                        className="p-3 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-move"
                      >
                        <p className="font-medium text-sm mb-2">{todo.title}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {todo.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* In Progress */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    In Progress
                    <Badge variant="secondary" className="ml-auto">
                      {todoData.todos.filter(t => t.status === "in_progress").length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todoData.todos
                    .filter((t) => t.status === "in_progress")
                    .map((todo) => (
                      <div
                        key={todo.id}
                        className="p-3 rounded-lg border bg-blue-500/5 border-blue-500/20 hover:shadow-md transition-shadow cursor-move"
                      >
                        <p className="font-medium text-sm mb-2">{todo.title}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {todo.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Done */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Done
                    <Badge variant="secondary" className="ml-auto">
                      {todoData.todos.filter(t => t.status === "done").length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todoData.todos
                    .filter((t) => t.status === "done")
                    .map((todo) => (
                      <div
                        key={todo.id}
                        className="p-3 rounded-lg border bg-green-500/5 border-green-500/20 hover:shadow-md transition-shadow cursor-move"
                      >
                        <p className="font-medium text-sm mb-2 line-through text-muted-foreground">
                          {todo.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {todo.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timeline View */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>타임라인</CardTitle>
                <CardDescription>
                  프로젝트 진행 일정을 시각화합니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  
                  <div className="space-y-6">
                    {todoData.todos.map((todo, index) => (
                      <div key={todo.id} className="relative flex items-start gap-4 pl-10">
                        {/* Timeline dot */}
                        <div className={`absolute left-2 w-5 h-5 rounded-full border-2 bg-background ${
                          todo.status === "done" 
                            ? "border-green-500" 
                            : todo.status === "in_progress"
                            ? "border-blue-500"
                            : "border-muted-foreground"
                        }`}>
                          {todo.status === "done" && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 absolute top-0.5 left-0.5" />
                          )}
                        </div>
                        
                        <div className="flex-1 pb-6">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${
                              todo.status === "done" ? "line-through text-muted-foreground" : ""
                            }`}>
                              {todo.title}
                            </h4>
                            <Badge className={getPriorityColor(todo.priority)}>
                              {todo.priority === "high" ? "높음" : 
                               todo.priority === "medium" ? "중간" : "낮음"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            카테고리: {todo.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

