import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      aiProvider,
      apiKey,
      appType,
      appName,
      shortDescription,
      detailedDescription,
      coreFeatures,
      targetUsers,
      referenceApps,
      userLevel,
      documentType,
    } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API 키가 필요합니다" },
        { status: 400 }
      );
    }

    const systemPrompt = getSystemPrompt(documentType, userLevel);
    const userPrompt = getUserPrompt({
      appType,
      appName,
      shortDescription,
      detailedDescription,
      coreFeatures,
      targetUsers,
      referenceApps,
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
        max_tokens: 4000,
      });
      content = response.choices[0]?.message?.content || "";
    } else if (aiProvider === "claude") {
      const client = new Anthropic({ apiKey });
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });
      const textBlock = response.content.find((block) => block.type === "text");
      content = textBlock?.type === "text" ? textBlock.text : "";
    } else if (aiProvider === "google") {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        systemInstruction: systemPrompt,
      });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          maxOutputTokens: 4000,
          temperature: 0.7,
        },
      });
      content = result.response.text();
    } else {
      return NextResponse.json(
        { error: "지원하지 않는 AI 제공자입니다" },
        { status: 400 }
      );
    }

    return NextResponse.json({ content, documentType });
  } catch (error: unknown) {
    console.error("Document generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "문서 생성 중 오류가 발생했습니다";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

function getSystemPrompt(documentType: string, userLevel: string): string {
  const levelGuide: Record<string, string> = {
    beginner: "초보자도 이해할 수 있도록 쉽고 자세하게 설명하세요. 기술 용어는 간단히 풀어서 설명해주세요.",
    intermediate: "중급 수준의 개발자가 이해할 수 있도록 작성하세요. 기본적인 용어는 설명 없이 사용해도 됩니다.",
    advanced: "경험있는 개발자를 위해 간결하고 핵심적인 내용으로 작성하세요.",
  };

  const basePrompt = `당신은 소프트웨어 개발 문서 작성 전문가입니다. 
${levelGuide[userLevel] || levelGuide.beginner}
문서는 마크다운 형식으로 작성하세요.
한국어로 작성하세요.`;

  const typePrompts: Record<string, string> = {
    planning: `${basePrompt}

기획문서를 작성해주세요. 다음 섹션을 포함하세요:
1. 프로젝트 개요
2. 프로젝트 목표 및 범위
3. 주요 기능 요약
4. 대상 사용자
5. 성공 지표
6. 프로젝트 일정 (예상)
7. 리스크 및 대응 방안`,

    prd: `${basePrompt}

PRD(제품 요구사항 문서)를 작성해주세요. 다음 섹션을 포함하세요:
1. 제품 개요
2. 사용자 페르소나
3. 사용자 스토리 (User Story 형식으로)
4. 기능 요구사항 (상세하게)
5. 비기능 요구사항
6. 우선순위 및 마일스톤
7. 제약 조건 및 가정`,

    trd: `${basePrompt}

TRD(기술 요구사항 문서)를 작성해주세요. 다음 섹션을 포함하세요:
1. 기술 개요
2. 시스템 아키텍처
3. 기술 스택 추천
4. API 설계
5. 데이터 모델
6. 보안 요구사항
7. 성능 요구사항
8. 배포 전략`,

    tdd: `${basePrompt}

TDD 문서를 작성해주세요. 다음 섹션을 포함하세요:
1. 테스트 전략 개요
2. 테스트 환경 설정
3. 기능별 테스트 케이스 목록
4. 사용자 시나리오 기반 E2E 테스트
5. 테스트 코드 예시
6. 테스트 커버리지 목표
7. TDD 워크플로우 가이드`,

    todo: `${basePrompt}

TODO 리스트를 작성해주세요. 다음 형식으로 작성하세요:
1. 단계별로 구분 (설정, UI 구현, 기능 구현, 테스트, 배포)
2. 각 항목에 우선순위 표시 (높음/중간/낮음)
3. 예상 소요 시간 포함
4. 의존성 표시
5. 체크리스트 형식`,
  };

  return typePrompts[documentType] || basePrompt;
}

function getUserPrompt(params: {
  appType: string;
  appName: string;
  shortDescription: string;
  detailedDescription: string;
  coreFeatures: string[];
  targetUsers: string;
  referenceApps: string;
}): string {
  return `다음 앱에 대한 문서를 작성해주세요:

## 앱 정보
- 앱 유형: ${params.appType}
- 앱 이름: ${params.appName}
- 한 줄 설명: ${params.shortDescription}

## 상세 설명
${params.detailedDescription}

## 핵심 기능
${params.coreFeatures.map((f) => `- ${f}`).join("\n")}

## 대상 사용자
${params.targetUsers || "일반 사용자"}

## 참고 앱/서비스
${params.referenceApps || "없음"}

위 정보를 바탕으로 완성도 높은 문서를 작성해주세요.`;
}

