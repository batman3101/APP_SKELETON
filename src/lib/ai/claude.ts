import Anthropic from "@anthropic-ai/sdk";

export function createClaudeClient(apiKey: string) {
  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
}

export interface GenerateDocumentParams {
  appType: string;
  appName: string;
  shortDescription: string;
  detailedDescription: string;
  coreFeatures: string[];
  targetUsers: string;
  referenceApps: string;
  userLevel: "beginner" | "intermediate" | "advanced";
  documentType: "planning" | "prd" | "trd" | "tdd" | "todo";
}

export async function generateDocumentWithClaude(
  client: Anthropic,
  params: GenerateDocumentParams
): Promise<string> {
  const systemPrompt = getSystemPrompt(params.documentType, params.userLevel);
  const userPrompt = getUserPrompt(params);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [
      { role: "user", content: userPrompt },
    ],
    system: systemPrompt,
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.type === "text" ? textBlock.text : "";
}

function getSystemPrompt(
  documentType: string,
  userLevel: string
): string {
  const levelGuide = {
    beginner: "초보자도 이해할 수 있도록 쉽고 자세하게 설명하세요. 기술 용어는 간단히 풀어서 설명해주세요.",
    intermediate: "중급 수준의 개발자가 이해할 수 있도록 작성하세요. 기본적인 용어는 설명 없이 사용해도 됩니다.",
    advanced: "경험있는 개발자를 위해 간결하고 핵심적인 내용으로 작성하세요.",
  };

  const basePrompt = `당신은 소프트웨어 개발 문서 작성 전문가입니다. 
${levelGuide[userLevel as keyof typeof levelGuide]}
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
3. 기술 스택 추천 (프론트엔드, 백엔드, 데이터베이스 등)
4. API 설계 (주요 엔드포인트)
5. 데이터 모델
6. 보안 요구사항
7. 성능 요구사항
8. 배포 전략`,

    tdd: `${basePrompt}

TDD 문서(테스트 주도 개발 가이드)를 작성해주세요. 다음 섹션을 포함하세요:
1. 테스트 전략 개요
2. 테스트 환경 설정 (Jest/Vitest 기반)
3. 기능별 테스트 케이스 목록 (표 형식)
4. 사용자 시나리오 기반 E2E 테스트
5. 테스트 코드 예시 (TypeScript)
6. 테스트 커버리지 목표
7. TDD 워크플로우 가이드 (Red-Green-Refactor)`,

    todo: `${basePrompt}

TODO 리스트를 작성해주세요. 다음 형식으로 작성하세요:
1. 단계별로 구분 (설정, UI 구현, 기능 구현, 테스트, 배포)
2. 각 항목에 우선순위 표시 (높음/중간/낮음)
3. 예상 소요 시간 포함
4. 의존성이 있는 경우 표시
5. 체크리스트 형식으로 작성`,
  };

  return typePrompts[documentType] || basePrompt;
}

function getUserPrompt(params: GenerateDocumentParams): string {
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

