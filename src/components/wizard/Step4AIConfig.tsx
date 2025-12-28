"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Bot,
  Key,
  FileText,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIConfigData {
  aiProvider: string;
  apiKey: string;
  userLevel: string;
  documentsToGenerate: string[];
}

interface Step4AIConfigProps {
  value: AIConfigData;
  onChange: (value: AIConfigData) => void;
}

const aiProviders = [
  {
    id: "openai",
    name: "OpenAI (GPT-4)",
    description: "가장 널리 사용되는 AI",
    recommended: true,
  },
  {
    id: "claude",
    name: "Claude (Anthropic)",
    description: "코드 생성에 강력함",
    recommended: false,
  },
];

const userLevels = [
  {
    id: "beginner",
    title: "초보자",
    description: "코딩 경험이 전혀 없어요",
  },
  {
    id: "intermediate",
    title: "중급자",
    description: "기본적인 프로그래밍을 알아요",
  },
  {
    id: "advanced",
    title: "고급자",
    description: "개발 경험이 있어요",
  },
];

const documentTypes = [
  { id: "planning", label: "기획문서", description: "프로젝트 개요, 목표, 일정" },
  { id: "prd", label: "PRD", description: "제품 요구사항, 기능 명세" },
  { id: "trd", label: "TRD", description: "기술 요구사항, 아키텍처" },
  { id: "tdd", label: "TDD 문서", description: "테스트 전략, 테스트 케이스" },
  { id: "todo", label: "TODO List", description: "개발 할 일 목록" },
];

export function Step4AIConfig({ value, onChange }: Step4AIConfigProps) {
  const handleDocumentToggle = (docId: string) => {
    const current = value.documentsToGenerate;
    const updated = current.includes(docId)
      ? current.filter((id) => id !== docId)
      : [...current, docId];
    onChange({ ...value, documentsToGenerate: updated });
  };

  return (
    <div className="space-y-8">
      <div>
        <Label className="text-base">AI 및 옵션 설정</Label>
        <p className="text-sm text-muted-foreground mt-1">
          AI 서비스와 생성 옵션을 설정해주세요
        </p>
      </div>

      {/* AI Provider Selection */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          AI 서비스 선택
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {aiProviders.map((provider) => (
            <Card
              key={provider.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                value.aiProvider === provider.id && "ring-2 ring-primary border-primary"
              )}
              onClick={() => onChange({ ...value, aiProvider: provider.id })}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{provider.name}</span>
                  {provider.recommended && (
                    <Badge variant="secondary" className="text-xs">추천</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {provider.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* API Key */}
      <div className="space-y-2">
        <Label htmlFor="apiKey" className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          API 키
        </Label>
        <Input
          id="apiKey"
          type="password"
          placeholder={value.aiProvider === "openai" ? "sk-..." : "sk-ant-..."}
          value={value.apiKey}
          onChange={(e) => onChange({ ...value, apiKey: e.target.value })}
        />
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <p>
            API 키는 로컬에만 저장되며 외부로 전송되지 않습니다.
            {value.aiProvider === "openai" ? (
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                OpenAI에서 발급받기
              </a>
            ) : (
              <a 
                href="https://console.anthropic.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                Anthropic에서 발급받기
              </a>
            )}
          </p>
        </div>
      </div>

      {/* User Level */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          사용자 수준
        </Label>
        <p className="text-xs text-muted-foreground -mt-1">
          수준에 맞춰 문서의 상세도가 조절됩니다
        </p>
        <RadioGroup
          value={value.userLevel}
          onValueChange={(val) => onChange({ ...value, userLevel: val })}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {userLevels.map((level) => (
            <Label
              key={level.id}
              htmlFor={level.id}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer transition-all hover:bg-muted/50",
                value.userLevel === level.id && "ring-2 ring-primary border-primary bg-primary/5"
              )}
            >
              <RadioGroupItem value={level.id} id={level.id} className="sr-only" />
              <span className="font-medium">{level.title}</span>
              <span className="text-xs text-muted-foreground text-center mt-1">
                {level.description}
              </span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* Documents to Generate */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          생성할 문서
        </Label>
        <div className="space-y-2">
          {documentTypes.map((doc) => (
            <div
              key={doc.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50",
                value.documentsToGenerate.includes(doc.id) && "border-primary bg-primary/5"
              )}
              onClick={() => handleDocumentToggle(doc.id)}
            >
              <Checkbox
                id={doc.id}
                checked={value.documentsToGenerate.includes(doc.id)}
                onCheckedChange={() => handleDocumentToggle(doc.id)}
              />
              <div className="flex-1">
                <Label htmlFor={doc.id} className="cursor-pointer font-medium">
                  {doc.label}
                </Label>
                <p className="text-xs text-muted-foreground">{doc.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

