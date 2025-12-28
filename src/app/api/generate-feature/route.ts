import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      aiProvider,
      apiKey,
      projectContext,
      featureName,
      featureDescription,
      userLevel,
      documentTypes, // ["prd", "trd", "tdd", "todo"]
    } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API 키가 필요합니다" },
        { status: 400 }
      );
    }

    const results: Record<string, string> = {};

    for (const docType of documentTypes) {
      const systemPrompt = getFeatureSystemPrompt(docType, userLevel);
      const userPrompt = getFeatureUserPrompt({
        projectContext,
        featureName,
        featureDescription,
        docType,
      });

      let content = "";

      if (aiProvider === "openai") {
        const client = new OpenAI({ apiKey });
        const response = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 3000,
        });
        content = response.choices[0]?.message?.content || "";
      } else if (aiProvider === "claude") {
        const client = new Anthropic({ apiKey });
        const response = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        });
        const textBlock = response.content.find((block) => block.type === "text");
        content = textBlock?.type === "text" ? textBlock.text : "";
      }

      results[docType] = content;
    }

    return NextResponse.json({ documents: results, featureName });
  } catch (error: unknown) {
    console.error("Feature document generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "문서 생성 중 오류가 발생했습니다";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

function getFeatureSystemPrompt(documentType: string, userLevel: string): string {
  const levelGuide: Record<string, string> = {
    beginner: "초보자도 이해할 수 있도록 쉽고 자세하게 설명하세요.",
    intermediate: "중급 수준의 개발자가 이해할 수 있도록 작성하세요.",
    advanced: "경험있는 개발자를 위해 간결하게 작성하세요.",
  };

  const basePrompt = `당신은 소프트웨어 개발 문서 작성 전문가입니다.
${levelGuide[userLevel] || levelGuide.beginner}
기존 프로젝트에 추가되는 기능에 대한 문서를 작성합니다.
문서는 마크다운 형식으로 작성하세요.
한국어로 작성하세요.`;

  const typePrompts: Record<string, string> = {
    prd: `${basePrompt}

추가 기능에 대한 기능 PRD를 작성해주세요:
1. 기능 개요
2. 사용자 스토리
3. 상세 기능 요구사항
4. 기존 기능과의 연관성
5. 우선순위`,

    trd: `${basePrompt}

추가 기능에 대한 기능 TRD를 작성해주세요:
1. 기술 개요
2. 구현 방안
3. 필요한 API/컴포넌트
4. 데이터 구조 변경사항
5. 주의사항`,

    tdd: `${basePrompt}

추가 기능에 대한 테스트 케이스를 작성해주세요:
1. 테스트 시나리오
2. 단위 테스트 케이스 목록
3. 통합 테스트 케이스
4. 테스트 코드 예시`,

    todo: `${basePrompt}

추가 기능 구현을 위한 TODO 항목을 작성해주세요:
- 체크리스트 형식으로
- 우선순위 표시 (높음/중간/낮음)
- 예상 소요 시간 포함
- 기존 TODO에 병합 가능한 형식으로`,
  };

  return typePrompts[documentType] || basePrompt;
}

function getFeatureUserPrompt(params: {
  projectContext: string;
  featureName: string;
  featureDescription: string;
  docType: string;
}): string {
  return `## 기존 프로젝트 정보
${params.projectContext}

## 추가할 기능
- 기능 이름: ${params.featureName}
- 기능 설명: ${params.featureDescription}

위 정보를 바탕으로 추가 기능에 대한 ${params.docType.toUpperCase()} 문서를 작성해주세요.
기존 프로젝트와의 연관성을 고려하여 작성해주세요.`;
}

