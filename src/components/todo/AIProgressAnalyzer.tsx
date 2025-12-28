"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Sparkles, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { Todo } from "@/stores/todoStore";
import { cn } from "@/lib/utils";

interface AnalysisResult {
  todoId: string;
  todoTitle: string;
  isCompleted: boolean;
  confidence: number;
  reason: string;
}

interface AIProgressAnalyzerProps {
  todos: Todo[];
  apiKey: string;
  aiProvider: "openai" | "claude";
  onApplyResults: (completedTodoIds: string[]) => void;
}

export function AIProgressAnalyzer({ 
  todos, 
  apiKey, 
  aiProvider, 
  onApplyResults 
}: AIProgressAnalyzerProps) {
  const [codebaseInfo, setCodebaseInfo] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!codebaseInfo.trim() || !apiKey) {
      setError("코드베이스 정보와 API 키가 필요합니다");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aiProvider,
          apiKey,
          codebaseInfo,
          todos: todos.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            category: t.category,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("분석 중 오류가 발생했습니다");
      }

      const data = await response.json();
      setResults(data.results);
      setSelectedResults(
        data.results
          .filter((r: AnalysisResult) => r.isCompleted && r.confidence >= 0.7)
          .map((r: AnalysisResult) => r.todoId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleResult = (todoId: string) => {
    setSelectedResults((prev) =>
      prev.includes(todoId)
        ? prev.filter((id) => id !== todoId)
        : [...prev, todoId]
    );
  };

  const handleApply = () => {
    onApplyResults(selectedResults);
    setResults([]);
    setSelectedResults([]);
    setCodebaseInfo("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI 진행도 분석
        </CardTitle>
        <CardDescription>
          코드베이스 정보를 입력하면 AI가 구현된 기능을 분석합니다
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!results.length ? (
          <>
            <div className="space-y-2">
              <Textarea
                placeholder={`현재 코드베이스 상태를 붙여넣기 해주세요.

예시:
- 폴더 구조 (tree 명령 결과)
- 주요 파일 목록
- 구현된 컴포넌트/함수 목록
- git log 최근 커밋 내역`}
                value={codebaseInfo}
                onChange={(e) => setCodebaseInfo(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !codebaseInfo.trim()}
              className="w-full gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  진행도 분석하기
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.todoId}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border",
                    result.isCompleted && "bg-green-500/5 border-green-500/20"
                  )}
                >
                  <Checkbox
                    checked={selectedResults.includes(result.todoId)}
                    onCheckedChange={() => handleToggleResult(result.todoId)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{result.todoTitle}</span>
                      {result.isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {result.reason}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "mt-2 text-xs",
                        result.confidence >= 0.8 && "bg-green-500/10 text-green-600",
                        result.confidence >= 0.5 && result.confidence < 0.8 && "bg-yellow-500/10 text-yellow-600",
                        result.confidence < 0.5 && "bg-red-500/10 text-red-600"
                      )}
                    >
                      신뢰도: {Math.round(result.confidence * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setResults([]);
                  setSelectedResults([]);
                }}
                className="flex-1 gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                다시 분석
              </Button>
              <Button
                onClick={handleApply}
                disabled={selectedResults.length === 0}
                className="flex-1 gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                {selectedResults.length}개 항목 완료 처리
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

