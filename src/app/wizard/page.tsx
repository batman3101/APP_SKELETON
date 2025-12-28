"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Sparkles, Home } from "lucide-react";
import Link from "next/link";
import {
  StepIndicator,
  Step1AppType,
  Step2Idea,
  Step3Features,
  Step4AIConfig,
  Step5Generate,
} from "@/components/wizard";

const steps = [
  { id: 1, title: "앱 유형", description: "어떤 종류의 앱을 만들고 싶으신가요?" },
  { id: 2, title: "아이디어", description: "앱에 대해 설명해주세요" },
  { id: 3, title: "기능 정의", description: "핵심 기능을 정의해주세요" },
  { id: 4, title: "AI 설정", description: "AI 서비스와 옵션을 설정해주세요" },
  { id: 5, title: "문서 생성", description: "AI가 문서를 생성합니다" },
];

interface WizardData {
  appType: string;
  idea: {
    name: string;
    shortDescription: string;
    detailedDescription: string;
  };
  features: {
    coreFeatures: string[];
    targetUsers: string;
    referenceApps: string;
  };
  aiConfig: {
    aiProvider: string;
    apiKey: string;
    userLevel: string;
    documentsToGenerate: string[];
  };
}

const initialData: WizardData = {
  appType: "",
  idea: {
    name: "",
    shortDescription: "",
    detailedDescription: "",
  },
  features: {
    coreFeatures: [],
    targetUsers: "",
    referenceApps: "",
  },
  aiConfig: {
    aiProvider: "openai",
    apiKey: "",
    userLevel: "beginner",
    documentsToGenerate: ["planning", "prd", "trd", "tdd", "todo"],
  },
};

export default function WizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocuments, setGeneratedDocuments] = useState<string[]>([]);

  const progress = (currentStep / steps.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!data.appType;
      case 2:
        return !!(data.idea.name && data.idea.shortDescription && data.idea.detailedDescription);
      case 3:
        return data.features.coreFeatures.length >= 1;
      case 4:
        return !!(data.aiConfig.apiKey && data.aiConfig.documentsToGenerate.length > 0);
      case 5:
        return generatedDocuments.length === data.aiConfig.documentsToGenerate.length;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Implement actual API calls
    // Simulate generation process
    for (const docId of data.aiConfig.documentsToGenerate) {
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));
      setGeneratedDocuments((prev) => [...prev, docId]);
    }
    setIsGenerating(false);
  };

  const handleComplete = () => {
    // TODO: Save project to IndexedDB and redirect
    router.push("/dashboard");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1AppType
            value={data.appType}
            onChange={(value) => setData({ ...data, appType: value })}
          />
        );
      case 2:
        return (
          <Step2Idea
            value={data.idea}
            onChange={(value) => setData({ ...data, idea: value })}
          />
        );
      case 3:
        return (
          <Step3Features
            value={data.features}
            onChange={(value) => setData({ ...data, features: value })}
          />
        );
      case 4:
        return (
          <Step4AIConfig
            value={data.aiConfig}
            onChange={(value) => setData({ ...data, aiConfig: value })}
          />
        );
      case 5:
        return (
          <Step5Generate
            documentsToGenerate={data.aiConfig.documentsToGenerate}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            generatedDocuments={generatedDocuments}
          />
        );
      default:
        return null;
    }
  };

  const isComplete = currentStep === 5 && 
    generatedDocuments.length === data.aiConfig.documentsToGenerate.length &&
    generatedDocuments.length > 0;

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/">
              <Button variant="ghost" className="gap-2 -ml-4 mb-2">
                <Home className="h-4 w-4" />
                홈으로
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">새 프로젝트 시작하기</h1>
            <p className="text-muted-foreground mt-1">
              5단계만 따라하면 프로젝트에 필요한 모든 문서가 준비됩니다
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              단계 {currentStep} / {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% 완료
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="mb-8">
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={currentStep > 1 ? setCurrentStep : undefined}
          />
        </div>

        {/* Current Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1 || isGenerating}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            이전
          </Button>

          {isComplete ? (
            <Button onClick={handleComplete} className="gap-2">
              프로젝트 보기
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : currentStep === steps.length ? (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || generatedDocuments.length > 0}
              className="gap-2"
            >
              {isGenerating ? (
                <>생성 중...</>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  문서 생성
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2"
            >
              다음
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
