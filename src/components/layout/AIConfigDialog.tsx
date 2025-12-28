"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Bot,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIConfigStore, type AIProvider } from "@/stores/aiConfigStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const aiProviders = [
  {
    id: "openai" as AIProvider,
    name: "OpenAI",
    description: "가장 널리 사용되는 AI",
    placeholder: "sk-...",
    link: "https://platform.openai.com/api-keys",
    linkText: "OpenAI에서 발급",
    color: "bg-emerald-500",
    models: [
      { id: "gpt-4o", name: "GPT-4o", description: "최신 멀티모달 모델" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "빠르고 저렴한 모델" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", description: "강력한 추론 능력" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "경제적인 선택" },
    ],
  },
  {
    id: "claude" as AIProvider,
    name: "Claude",
    description: "코드 생성에 강력함",
    placeholder: "sk-ant-...",
    link: "https://console.anthropic.com/",
    linkText: "Anthropic에서 발급",
    color: "bg-orange-500",
    models: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", description: "최고 성능 모델" },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", description: "빠른 응답 속도" },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus", description: "복잡한 작업에 최적" },
    ],
  },
  {
    id: "google" as AIProvider,
    name: "Google AI",
    description: "무료 사용 가능!",
    placeholder: "AIza...",
    link: "https://aistudio.google.com/app/apikey",
    linkText: "Google AI Studio에서 발급",
    color: "bg-blue-500",
    recommended: true,
    models: [
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "빠른 속도, 무료! (추천)", isFree: true },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "강력한 추론, 무료!", isFree: true },
      { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (실험)", description: "🔥 최신 실험 모델, 무료 (quota 제한)", isFree: true, isNew: true },
      { id: "gemini-1.5-flash-8b", name: "Gemini 1.5 Flash 8B", description: "초고속, 무료!", isFree: true },
    ],
  },
];

export function AIConfigDialog() {
  const { aiProvider, aiModel, apiKey, isConfigured, setConfig } = useAIConfigStore();
  const [open, setOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(aiProvider);
  const [selectedModel, setSelectedModel] = useState(aiModel);
  const [inputApiKey, setInputApiKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  // Sync state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedProvider(aiProvider);
      setSelectedModel(aiModel);
      setInputApiKey(apiKey);
    }
  }, [open, aiProvider, aiModel, apiKey]);

  const handleSave = () => {
    setConfig(selectedProvider, selectedModel, inputApiKey);
    setOpen(false);
  };

  const selectedProviderInfo = aiProviders.find((p) => p.id === selectedProvider);
  const currentModel = selectedProviderInfo?.models.find((m) => m.id === selectedModel);

  const handleProviderChange = (providerId: AIProvider) => {
    setSelectedProvider(providerId);
    const provider = aiProviders.find((p) => p.id === providerId);
    if (provider && provider.models.length > 0) {
      setSelectedModel(provider.models[0].id);
    }
    setInputApiKey(""); // Clear key when switching
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isConfigured ? "outline" : "default"}
          size="sm"
          className={cn(
            "gap-2",
            !isConfigured && "animate-pulse"
          )}
        >
          {isConfigured ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="hidden sm:inline">AI 설정됨</span>
              <Settings className="h-4 w-4" />
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" />
              <span>AI 설정 필요</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI 설정
          </DialogTitle>
          <DialogDescription>
            사용할 AI 서비스와 API 키를 설정하세요. 한 번 설정하면 앱 전체에서 사용됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* AI Provider Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">AI 서비스 선택</Label>
            <div className="grid gap-2">
              {aiProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedProvider === provider.id && "ring-2 ring-primary border-primary"
                  )}
                  onClick={() => handleProviderChange(provider.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-10 rounded-full", provider.color)} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{provider.name}</span>
                          {provider.recommended && (
                            <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              <Sparkles className="h-3 w-3 mr-1" />
                              추천
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {provider.description}
                        </p>
                      </div>
                      {selectedProvider === provider.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          {selectedProviderInfo && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">모델 선택</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedProviderInfo.models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
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
                      <div className="text-xs text-muted-foreground">{model.description}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentModel && (
                <p className="text-sm text-muted-foreground">
                  {currentModel.description}
                </p>
              )}
            </div>
          )}

          {/* API Key Input */}
          <div className="space-y-3">
            <Label htmlFor="api-key" className="text-sm font-medium flex items-center gap-2">
              <Key className="h-4 w-4" />
              API 키 입력
            </Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder={selectedProviderInfo?.placeholder}
                value={inputApiKey}
                onChange={(e) => setInputApiKey(e.target.value)}
                className="pr-20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? "숨기기" : "보기"}
              </Button>
            </div>
            
            {/* Help Link */}
            {selectedProviderInfo && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">API 키가 없으신가요?</span>
                <a
                  href={selectedProviderInfo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {selectedProviderInfo.linkText}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Security Notice */}
            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div className="text-muted-foreground">
                <p className="font-medium text-foreground">🔒 보안 안내</p>
                <p>API 키는 브라우저의 로컬 저장소에만 저장됩니다. 서버로 전송되지 않으며, 이 기기에서만 사용됩니다.</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={!inputApiKey.trim()}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            저장하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

