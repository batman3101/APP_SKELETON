"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  FolderOpen, 
  FileText, 
  CheckSquare,
  MoreHorizontal,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 임시 데이터 - 나중에 IndexedDB에서 가져옴
const projects = [
  {
    id: "1",
    name: "쇼핑몰 앱",
    description: "온라인 쇼핑몰 웹앱 프로젝트",
    createdAt: "2024-12-25",
    progress: 35,
    documentCount: 5,
    todoCount: 12,
  },
  {
    id: "2", 
    name: "포트폴리오 사이트",
    description: "개인 포트폴리오 웹사이트",
    createdAt: "2024-12-20",
    progress: 80,
    documentCount: 5,
    todoCount: 8,
  },
];

export default function DashboardPage() {
  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">프로젝트 대시보드</h1>
          <p className="text-muted-foreground">
            생성된 프로젝트와 문서를 관리하세요
          </p>
        </div>
        <Link href="/wizard">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            새 프로젝트
          </Button>
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FolderOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {project.description}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href={`/project/${project.id}`} className="w-full">
                          상세보기
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/feature-add?project=${project.id}`} className="w-full">
                          기능 추가
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">진행률</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{project.documentCount} 문서</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckSquare className="h-4 w-4" />
                    <span>{project.todoCount} TODO</span>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{project.createdAt}</span>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4">
                  <Link href={`/project/${project.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      문서 보기
                    </Button>
                  </Link>
                  <Link href={`/project/${project.id}/todo`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      TODO 관리
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-full bg-muted mb-4">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">프로젝트가 없습니다</h3>
          <p className="text-muted-foreground text-center mb-6">
            새 프로젝트를 시작하여 AI가 생성한 문서를 확인하세요
          </p>
          <Link href="/wizard">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              첫 프로젝트 시작하기
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

