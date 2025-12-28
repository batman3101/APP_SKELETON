"use client";

import { useEffect, useState } from "react";
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
  Calendar,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProjects, deleteProject, DBProject } from "@/lib/db/projects";
import { db } from "@/lib/db";
import { toast } from "sonner";

interface ProjectWithStats extends DBProject {
  documentCount: number;
  todoCount: number;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const allProjects = await getProjects();
      
      // 각 프로젝트의 문서 및 TODO 개수 가져오기
      const projectsWithStats = await Promise.all(
        allProjects.map(async (project) => {
          const documents = await db.documents
            .where("projectUid")
            .equals(project.uid)
            .count();
          const todos = await db.todos
            .where("projectUid")
            .equals(project.uid)
            .count();
          
          return {
            ...project,
            documentCount: documents,
            todoCount: todos,
          };
        })
      );
      
      setProjects(projectsWithStats);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("프로젝트 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteProject(uid: string, name: string) {
    if (!confirm(`"${name}" 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      await deleteProject(uid);
      toast.success("프로젝트가 삭제되었습니다.");
      loadProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("프로젝트 삭제에 실패했습니다.");
    }
  }

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">프로젝트를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }
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
            <Card key={project.uid} className="group hover:shadow-lg transition-shadow">
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
                      <DropdownMenuItem asChild>
                        <Link href={`/project/${project.uid}`} className="w-full cursor-pointer">
                          상세보기
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/feature-add?project=${project.uid}`} className="w-full cursor-pointer">
                          기능 추가
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive cursor-pointer"
                        onClick={() => handleDeleteProject(project.uid, project.name)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
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
                  <span>{formatDate(project.createdAt)}</span>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4">
                  <Link href={`/project/${project.uid}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      문서 보기
                    </Button>
                  </Link>
                  <Link href={`/project/${project.uid}/todo`} className="flex-1">
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

