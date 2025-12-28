"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface IdeaData {
  name: string;
  shortDescription: string;
  detailedDescription: string;
}

interface Step2IdeaProps {
  value: IdeaData;
  onChange: (value: IdeaData) => void;
}

export function Step2Idea({ value, onChange }: Step2IdeaProps) {
  const handleChange = (field: keyof IdeaData, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base">앱에 대해 설명해주세요</Label>
        <p className="text-sm text-muted-foreground mt-1">
          만들고자 하는 앱의 아이디어를 자세히 설명해주세요
        </p>
      </div>

      {/* App Name */}
      <div className="space-y-2">
        <Label htmlFor="appName">앱 이름 *</Label>
        <Input
          id="appName"
          placeholder="예: 오늘의 할일, 맛집 추천 앱"
          value={value.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      {/* Short Description */}
      <div className="space-y-2">
        <Label htmlFor="shortDesc">한 줄 설명 *</Label>
        <Input
          id="shortDesc"
          placeholder="예: 바쁜 직장인을 위한 간편한 할일 관리 앱"
          value={value.shortDescription}
          onChange={(e) => handleChange("shortDescription", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          앱을 한 문장으로 설명해주세요
        </p>
      </div>

      {/* Detailed Description */}
      <div className="space-y-2">
        <Label htmlFor="detailedDesc">상세 설명 *</Label>
        <Textarea
          id="detailedDesc"
          placeholder={`앱에 대해 자세히 설명해주세요.

예시:
- 어떤 문제를 해결하고 싶은가요?
- 누가 이 앱을 사용하나요?
- 어떤 기능이 필요한가요?
- 비슷한 앱이 있다면 무엇인가요?`}
          value={value.detailedDescription}
          onChange={(e) => handleChange("detailedDescription", e.target.value)}
          className="min-h-[200px]"
        />
        <p className="text-xs text-muted-foreground">
          자세히 설명할수록 더 정확한 문서가 생성됩니다
        </p>
      </div>

      {/* Tip Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">작성 팁</p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• 앱을 사용할 대상 사용자를 명확히 해주세요</li>
                <li>• 핵심 기능 2-3개를 포함해주세요</li>
                <li>• 참고할 만한 유사 앱이 있다면 언급해주세요</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

