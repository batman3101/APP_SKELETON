"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Users, Lightbulb } from "lucide-react";

interface FeaturesData {
  coreFeatures: string[];
  targetUsers: string;
  referenceApps: string;
}

interface Step3FeaturesProps {
  value: FeaturesData;
  onChange: (value: FeaturesData) => void;
}

export function Step3Features({ value, onChange }: Step3FeaturesProps) {
  const [newFeature, setNewFeature] = useState("");

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      onChange({
        ...value,
        coreFeatures: [...value.coreFeatures, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    onChange({
      ...value,
      coreFeatures: value.coreFeatures.filter((_, i) => i !== index),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base">기능을 정의해주세요</Label>
        <p className="text-sm text-muted-foreground mt-1">
          앱에 필요한 핵심 기능과 대상 사용자를 정의해주세요
        </p>
      </div>

      {/* Core Features */}
      <div className="space-y-3">
        <Label>핵심 기능 목록 *</Label>
        <div className="flex gap-2">
          <Input
            placeholder="예: 회원가입/로그인"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={handleAddFeature} type="button" variant="secondary">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {value.coreFeatures.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {value.coreFeatures.map((feature, index) => (
              <Badge key={index} variant="secondary" className="gap-1 py-1.5 px-3">
                {feature}
                <button
                  onClick={() => handleRemoveFeature(index)}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            핵심 기능을 하나씩 추가해주세요 (최소 2개 권장)
          </p>
        )}

        {/* Feature Suggestions */}
        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <p className="text-xs font-medium mb-2 flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              자주 사용되는 기능 예시
            </p>
            <div className="flex flex-wrap gap-1">
              {[
                "회원가입/로그인",
                "상품 목록",
                "검색",
                "장바구니",
                "결제",
                "마이페이지",
                "알림",
                "설정",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    if (!value.coreFeatures.includes(suggestion)) {
                      onChange({
                        ...value,
                        coreFeatures: [...value.coreFeatures, suggestion],
                      });
                    }
                  }}
                  className="text-xs px-2 py-1 rounded bg-background hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Target Users */}
      <div className="space-y-2">
        <Label htmlFor="targetUsers" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          대상 사용자
        </Label>
        <Textarea
          id="targetUsers"
          placeholder={`이 앱을 사용할 사람들에 대해 설명해주세요.

예시:
- 20-30대 직장인
- 시간 관리가 필요한 학생
- 요리를 좋아하는 자취생`}
          value={value.targetUsers}
          onChange={(e) => onChange({ ...value, targetUsers: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      {/* Reference Apps */}
      <div className="space-y-2">
        <Label htmlFor="referenceApps">참고할 유사 앱/서비스 (선택)</Label>
        <Input
          id="referenceApps"
          placeholder="예: 노션, 트렐로, 토스"
          value={value.referenceApps}
          onChange={(e) => onChange({ ...value, referenceApps: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          비슷한 앱이 있다면 알려주세요. AI가 참고하여 더 나은 문서를 생성합니다.
        </p>
      </div>
    </div>
  );
}

