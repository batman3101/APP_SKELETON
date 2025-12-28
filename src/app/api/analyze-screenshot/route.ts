import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, imageBase64, imageUrl } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API 키가 필요합니다" },
        { status: 400 }
      );
    }

    if (!imageBase64 && !imageUrl) {
      return NextResponse.json(
        { error: "이미지가 필요합니다" },
        { status: 400 }
      );
    }

    const client = new OpenAI({ apiKey });

    const systemPrompt = `당신은 웹 디자인 분석 전문가입니다.
이미지에서 다음 정보를 추출하여 JSON 형식으로 반환해주세요:

{
  "colors": [
    {
      "hex": "#RRGGBB",
      "name": "색상 이름",
      "usage": "사용 용도 (배경, 버튼, 텍스트 등)"
    }
  ],
  "typography": [
    {
      "fontFamily": "폰트 추정",
      "fontSize": "크기 추정",
      "fontWeight": "굵기",
      "usage": "사용 용도"
    }
  ],
  "layoutStyle": "레이아웃 스타일 설명",
  "designCharacteristics": ["특징1", "특징2"],
  "tailwindConfig": "Tailwind CSS 색상 설정 코드",
  "cssVariables": "CSS 변수 코드",
  "aiPrompt": "이 디자인을 AI에게 설명할 프롬프트"
}

JSON만 반환하고 다른 설명은 포함하지 마세요.`;

    const imageContent = imageBase64
      ? { type: "image_url" as const, image_url: { url: `data:image/png;base64,${imageBase64}` } }
      : { type: "image_url" as const, image_url: { url: imageUrl } };

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: "이 웹사이트 스크린샷의 디자인을 분석해주세요." },
            imageContent,
          ],
        },
      ],
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "";

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("JSON 형식을 찾을 수 없습니다");
      }
      const result = JSON.parse(jsonMatch[0]);
      return NextResponse.json(result);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "AI 응답을 파싱하는 데 실패했습니다", raw: content },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Screenshot analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : "분석 중 오류가 발생했습니다";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

