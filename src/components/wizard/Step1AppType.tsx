"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Globe, 
  Smartphone, 
  Monitor, 
  MoreHorizontal 
} from "lucide-react";
import { cn } from "@/lib/utils";

const appTypes = [
  {
    id: "web",
    title: "웹 앱",
    description: "브라우저에서 실행되는 웹 애플리케이션",
    icon: Globe,
    examples: "쇼핑몰, 블로그, 대시보드 등",
  },
  {
    id: "mobile",
    title: "모바일 앱",
    description: "스마트폰에서 실행되는 앱",
    icon: Smartphone,
    examples: "iOS/Android 앱, PWA 등",
  },
  {
    id: "desktop",
    title: "데스크톱 앱",
    description: "PC에서 실행되는 프로그램",
    icon: Monitor,
    examples: "Electron 앱, 관리 도구 등",
  },
  {
    id: "other",
    title: "기타",
    description: "위에 해당하지 않는 프로젝트",
    icon: MoreHorizontal,
    examples: "API, 라이브러리, CLI 도구 등",
  },
];

interface Step1AppTypeProps {
  value: string;
  onChange: (value: string) => void;
}

export function Step1AppType({ value, onChange }: Step1AppTypeProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base">어떤 종류의 앱을 만들고 싶으신가요?</Label>
        <p className="text-sm text-muted-foreground mt-1">
          만들고자 하는 앱의 유형을 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {appTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = value === type.id;

          return (
            <Card
              key={type.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                isSelected && "ring-2 ring-primary border-primary"
              )}
              onClick={() => onChange(type.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-lg transition-colors",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{type.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {type.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      예: {type.examples}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

