import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface TodoInfo {
  id: string;
  title: string;
  description?: string;
  category: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { aiProvider, apiKey, codebaseInfo, todos } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API 키가 필요합니다" },
        { status: 400 }
      );
    }

    const systemPrompt = `당신은 소프트웨어 개발 진행도 분석 전문가입니다.
사용자가 제공한 코드베이스 정보를 분석하여 각 TODO 항목이 완료되었는지 판단해주세요.

각 TODO 항목에 대해 다음 형식으로 JSON 배열을 반환해주세요:
[
  {
    "todoId": "TODO ID",
    "todoTitle": "TODO 제목",
    "isCompleted": true/false,
    "confidence": 0.0-1.0 사이의 신뢰도,
    "reason": "판단 이유 (간단히)"
  }
]

판단 기준:
- 관련 파일/폴더가 존재하는지
- 해당 기능에 대한 코드가 구현되어 있는지
- 커밋 내역에 관련 작업이 있는지

확실하지 않은 경우 confidence를 낮게 설정하세요.
JSON만 반환하고 다른 설명은 포함하지 마세요.`;

    const userPrompt = `## 코드베이스 정보
${codebaseInfo}

## TODO 항목 목록
${todos.map((t: TodoInfo) => `- [${t.id}] ${t.title} (${t.category}): ${t.description || "설명 없음"}`).join("\n")}

위 정보를 바탕으로 각 TODO 항목의 완료 여부를 분석해주세요.`;

    let content = "";

    if (aiProvider === "openai") {
      const client = new OpenAI({ apiKey });
      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });
      content = response.choices[0]?.message?.content || "";
    } else if (aiProvider === "claude") {
      const client = new Anthropic({ apiKey });
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
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
          maxOutputTokens: 2000,
          temperature: 0.3,
        },
      });
      content = result.response.text();
    } else {
      return NextResponse.json(
        { error: "지원하지 않는 AI 제공자입니다" },
        { status: 400 }
      );
    }

    // Parse JSON response
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("JSON 형식을 찾을 수 없습니다");
      }
      const results = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ results });
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "AI 응답을 파싱하는 데 실패했습니다", raw: content },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Progress analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : "분석 중 오류가 발생했습니다";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

