"use client";

import { use } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Plus,
  CheckSquare,
  Edit,
  Trash2
} from "lucide-react";

// 임시 프로젝트 데이터
const projectData = {
  id: "1",
  name: "쇼핑몰 앱",
  description: "온라인 쇼핑몰 웹앱 프로젝트",
  createdAt: "2024-12-25",
  documents: [
    { id: "1", type: "planning", title: "기획문서", status: "completed" },
    { id: "2", type: "prd", title: "PRD", status: "completed" },
    { id: "3", type: "trd", title: "TRD", status: "completed" },
    { id: "4", type: "tdd", title: "TDD 문서", status: "completed" },
    { id: "5", type: "todo", title: "TODO List", status: "in_progress" },
  ],
  additionalFeatures: [
    { id: "f1", name: "장바구니 기능", createdAt: "2024-12-26" },
  ],
};

const documentContent = `# 쇼핑몰 앱 기획문서

## 1. 프로젝트 개요
온라인 쇼핑몰 웹앱을 개발합니다.

## 2. 목표
- 사용자 친화적인 쇼핑 경험 제공
- 안정적인 결제 시스템 구축
- 모바일 반응형 디자인

## 3. 주요 기능
- 상품 목록 및 검색
- 장바구니
- 결제 시스템
- 주문 내역 조회

## 4. 일정
- 1주차: 기본 UI 구현
- 2주차: 상품 기능 구현
- 3주차: 결제 기능 구현
- 4주차: 테스트 및 배포
`;

export default function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  
  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2 mb-2 -ml-4">
                <ArrowLeft className="h-4 w-4" />
                대시보드로 돌아가기
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">{projectData.name}</h1>
            <p className="text-muted-foreground">{projectData.description}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/feature-add?project=${id}`}>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                기능 추가
              </Button>
            </Link>
            <Link href={`/project/${id}/todo`}>
              <Button className="gap-2">
                <CheckSquare className="h-4 w-4" />
                TODO 관리
              </Button>
            </Link>
          </div>
        </div>

        {/* Documents Tabs */}
        <Tabs defaultValue="planning" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-2">
            {projectData.documents.map((doc) => (
              <TabsTrigger key={doc.id} value={doc.type} className="gap-2">
                <FileText className="h-4 w-4" />
                {doc.title}
                {doc.status === "completed" && (
                  <Badge variant="secondary" className="ml-1 text-xs">완료</Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {projectData.documents.map((doc) => (
            <TabsContent key={doc.id} value={doc.type}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{doc.title}</CardTitle>
                      <CardDescription>
                        {projectData.name} - {doc.title}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        편집
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        내보내기
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg text-sm">
                      {documentContent}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Additional Features */}
        {projectData.additionalFeatures.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>추가된 기능 문서</CardTitle>
              <CardDescription>
                프로젝트에 추가된 기능 문서들입니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectData.additionalFeatures.map((feature) => (
                  <div 
                    key={feature.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-sm text-muted-foreground">
                          추가일: {feature.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        보기
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

