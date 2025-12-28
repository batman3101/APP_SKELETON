"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentStatus {
  id: string;
  title: string;
  status: "pending" | "generating" | "completed" | "error";
}

interface Step5GenerateProps {
  documentsToGenerate: string[];
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  generatedDocuments: string[];
}

const documentInfo: Record<string, { title: string; description: string }> = {
  planning: { title: "기획문서", description: "프로젝트 개요, 목표, 일정" },
  prd: { title: "PRD", description: "제품 요구사항, 기능 명세" },
  trd: { title: "TRD", description: "기술 요구사항, 아키텍처" },
  tdd: { title: "TDD 문서", description: "테스트 전략, 테스트 케이스" },
  todo: { title: "TODO List", description: "개발 할 일 목록" },
};

export function Step5Generate({ 
  documentsToGenerate, 
  onGenerate,
  isGenerating,
  generatedDocuments 
}: Step5GenerateProps) {
  const [documents, setDocuments] = useState<DocumentStatus[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDocuments(
      documentsToGenerate.map((id) => ({
        id,
        title: documentInfo[id]?.title || id,
        status: generatedDocuments.includes(id) ? "completed" : "pending",
      }))
    );
  }, [documentsToGenerate, generatedDocuments]);

  useEffect(() => {
    if (isGenerating && currentIndex < documents.length) {
      const timer = setTimeout(() => {
        setDocuments((prev) =>
          prev.map((doc, i) =>
            i === currentIndex ? { ...doc, status: "generating" } : doc
          )
        );
      }, 100);

      const completeTimer = setTimeout(() => {
        setDocuments((prev) =>
          prev.map((doc, i) =>
            i === currentIndex ? { ...doc, status: "completed" } : doc
          )
        );
        setCurrentIndex((prev) => prev + 1);
      }, 2000 + Math.random() * 1000);

      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    }
  }, [isGenerating, currentIndex, documents.length]);

  const completedCount = documents.filter((d) => d.status === "completed").length;
  const progress = documents.length > 0 ? (completedCount / documents.length) * 100 : 0;
  const isComplete = completedCount === documents.length && documents.length > 0;

  const getStatusIcon = (status: DocumentStatus["status"]) => {
    switch (status) {
      case "generating":
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {isComplete
            ? "문서 생성 완료!"
            : isGenerating
            ? "문서 생성 중..."
            : "문서 생성 준비 완료"}
        </h3>
        <p className="text-muted-foreground">
          {isComplete
            ? "모든 문서가 성공적으로 생성되었습니다"
            : isGenerating
            ? "AI가 문서를 생성하고 있습니다. 잠시만 기다려주세요."
            : "아래 버튼을 클릭하여 문서 생성을 시작하세요"}
        </p>
      </div>

      {/* Progress */}
      {(isGenerating || isComplete) && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">진행률</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Document List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">생성할 문서</CardTitle>
          <CardDescription>
            {completedCount} / {documents.length} 완료
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg border transition-all",
                  doc.status === "generating" && "border-primary bg-primary/5",
                  doc.status === "completed" && "bg-green-500/5 border-green-500/20",
                  doc.status === "error" && "bg-destructive/5 border-destructive/20"
                )}
              >
                {getStatusIcon(doc.status)}
                <div className="flex-1">
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {documentInfo[doc.id]?.description}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    doc.status === "generating" && "bg-primary/10 text-primary",
                    doc.status === "completed" && "bg-green-500/10 text-green-600",
                    doc.status === "error" && "bg-destructive/10 text-destructive"
                  )}
                >
                  {doc.status === "pending" && "대기 중"}
                  {doc.status === "generating" && "생성 중"}
                  {doc.status === "completed" && "완료"}
                  {doc.status === "error" && "오류"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="font-medium text-destructive">오류가 발생했습니다</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {!isGenerating && !isComplete && (
          <Button onClick={onGenerate} size="lg" className="gap-2">
            <Sparkles className="h-5 w-5" />
            문서 생성 시작
          </Button>
        )}
        {error && (
          <Button onClick={onGenerate} variant="outline" size="lg" className="gap-2">
            <RefreshCw className="h-5 w-5" />
            다시 시도
          </Button>
        )}
      </div>
    </div>
  );
}

