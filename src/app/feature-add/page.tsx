"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Sparkles, FileText, Loader2 } from "lucide-react";

// 임시 프로젝트 데이터
const projects = [
  { id: "1", name: "쇼핑몰 앱" },
  { id: "2", name: "포트폴리오 사이트" },
];

export default function FeatureAddPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const [featureName, setFeatureName] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedProject || !featureName || !featureDescription) return;
    
    setIsGenerating(true);
    // TODO: Implement feature document generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            대시보드로 돌아가기
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">추가 기능 문서 생성</h1>
          <p className="text-muted-foreground">
            기존 프로젝트에 새로운 기능을 추가하고 관련 문서를 생성하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                기능 정보 입력
              </CardTitle>
              <CardDescription>
                추가하려는 기능에 대해 설명해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Selection */}
              <div className="space-y-2">
                <Label htmlFor="project">프로젝트 선택</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="프로젝트를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Feature Name */}
              <div className="space-y-2">
                <Label htmlFor="featureName">기능 이름</Label>
                <Input
                  id="featureName"
                  placeholder="예: 장바구니 기능"
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                />
              </div>

              {/* Feature Description */}
              <div className="space-y-2">
                <Label htmlFor="featureDescription">기능 설명</Label>
                <Textarea
                  id="featureDescription"
                  placeholder="추가하려는 기능에 대해 자세히 설명해주세요.&#10;&#10;예: 사용자가 상품을 장바구니에 담고, 수량을 조절하고, 삭제할 수 있는 기능이 필요합니다. 로그인하지 않은 사용자도 장바구니를 사용할 수 있어야 합니다."
                  value={featureDescription}
                  onChange={(e) => setFeatureDescription(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate}
                disabled={!selectedProject || !featureName || !featureDescription || isGenerating}
                className="w-full gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    문서 생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    문서 생성하기
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview / Result */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                생성될 문서
              </CardTitle>
              <CardDescription>
                다음 문서들이 생성되고 TODO가 업데이트됩니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">기능 PRD</p>
                    <p className="text-sm text-muted-foreground">
                      추가 기능의 요구사항 명세
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">기능 TRD</p>
                    <p className="text-sm text-muted-foreground">
                      추가 기능의 기술 명세
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">기능 TDD</p>
                    <p className="text-sm text-muted-foreground">
                      추가 기능의 테스트 케이스
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium">TODO 업데이트</p>
                    <p className="text-sm text-muted-foreground">
                      기존 TODO에 새 항목 병합
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>팁:</strong> 기능을 구체적으로 설명할수록 
                  더 정확한 문서가 생성됩니다. 사용자 시나리오와 
                  예상되는 동작을 포함해주세요.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

