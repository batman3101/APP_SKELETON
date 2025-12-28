"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bot,
  Key,
  FileText,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIConfigStore } from "@/stores/aiConfigStore";

interface AIConfigData {
  aiProvider: string;
  aiModel: string;
  apiKey: string;
  userLevel: string;
  documentsToGenerate: string[];
}

interface Step4AIConfigProps {
  value: AIConfigData;
  onChange: (value: AIConfigData) => void;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  isFree?: boolean;
  isNew?: boolean;
}

interface AIProviderInfo {
  id: string;
  name: string;
  description: string;
  recommended?: boolean;
  models: AIModel[];
}

const aiProviders: AIProviderInfo[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "가장 널리 사용되는 AI",
    models: [
      { id: "gpt-4o", name: "GPT-4o", description: "최신 멀티모달 모델" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "빠르고 저렴한 모델" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", description: "강력한 추론 능력" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "경제적인 선택" },
    ],
  },
  {
    id: "claude",
    name: "Claude (Anthropic)",
    description: "코드 생성에 강력함",
    models: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", description: "최고 성능 모델" },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", description: "빠른 응답 속도" },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus", description: "복잡한 작업에 최적" },
    ],
  },
  {
    id: "google",
    name: "Google AI (Gemini)",
    description: "무료 사용 가능, 빠른 응답",
    recommended: true,
    models: [
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "빠른 속도, 무료! (추천)", isFree: true },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "강력한 추론, 무료!", isFree: true },
      { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (실험)", description: "최신 실험 모델, 무료 (quota 제한)", isFree: true, isNew: true },
      { id: "gemini-1.5-flash-8b", name: "Gemini 1.5 Flash 8B", description: "초고속, 무료!", isFree: true },
    ],
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
  const { aiProvider: savedProvider, aiModel: savedModel, apiKey: savedApiKey, isConfigured } = useAIConfigStore();

  // 저장된 AI 설정이 있으면 자동으로 불러오기
  useEffect(() => {
    if (isConfigured && !value.apiKey) {
      onChange({
        ...value,
        aiProvider: savedProvider,
        aiModel: savedModel,
        apiKey: savedApiKey,
      });
    }
  }, [isConfigured, savedProvider, savedModel, savedApiKey]);

  const handleDocumentToggle = (docId: string) => {
    const current = value.documentsToGenerate;
    const updated = current.includes(docId)
      ? current.filter((id) => id !== docId)
      : [...current, docId];
    onChange({ ...value, documentsToGenerate: updated });
  };

  const selectedProviderInfo = aiProviders.find((p) => p.id === value.aiProvider);
  const availableModels = selectedProviderInfo?.models || [];

  const handleProviderChange = (providerId: string) => {
    const provider = aiProviders.find((p) => p.id === providerId);
    onChange({
      ...value,
      aiProvider: providerId,
      aiModel: provider?.models[0]?.id || "",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <Label className="text-base">AI 및 옵션 설정</Label>
        <p className="text-sm text-muted-foreground mt-1">
          AI 서비스와 생성 옵션을 설정해주세요
        </p>
      </div>

      {/* 저장된 AI 설정 표시 */}
      {isConfigured && (
        <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">AI 설정이 이미 완료되어 있습니다!</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            헤더의 <Settings className="h-3 w-3 inline" /> 설정 버튼에서 저장한 API 키를 사용합니다.
            아래에서 변경하거나 그대로 사용하세요.
          </p>
        </div>
      )}

      {/* AI Provider Selection */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          AI 서비스 선택
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {aiProviders.map((provider) => (
            <Card
              key={provider.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                value.aiProvider === provider.id && "ring-2 ring-primary border-primary"
              )}
              onClick={() => handleProviderChange(provider.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{provider.name}</span>
                  {provider.recommended && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      <Sparkles className="h-3 w-3 mr-1" />
                      추천
                    </Badge>
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

      {/* Model Selection */}
      {availableModels.length > 0 && (
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            모델 선택
          </Label>
          <Select 
            value={value.aiModel} 
            onValueChange={(model) => onChange({ ...value, aiModel: model })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="모델을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{model.name}</span>
                      {model.isFree && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          무료
                        </Badge>
                      )}
                      {model.isNew && (
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* API Key */}
      <div className="space-y-2">
        <Label htmlFor="apiKey" className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          API 키
          {value.apiKey && (
            <Badge variant="outline" className="text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              입력됨
            </Badge>
          )}
        </Label>
        <Input
          id="apiKey"
          type="password"
          placeholder={
            value.aiProvider === "openai" 
              ? "sk-..." 
              : value.aiProvider === "claude" 
                ? "sk-ant-..." 
                : "AIza..."
          }
          value={value.apiKey}
          onChange={(e) => onChange({ ...value, apiKey: e.target.value })}
        />
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <p>
            API 키는 로컬에만 저장되며 외부로 전송되지 않습니다.
            {value.aiProvider === "openai" && (
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                OpenAI에서 발급받기
              </a>
            )}
            {value.aiProvider === "claude" && (
              <a 
                href="https://console.anthropic.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                Anthropic에서 발급받기
              </a>
            )}
            {value.aiProvider === "google" && (
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                Google AI Studio에서 발급받기
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

