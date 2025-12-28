import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Sparkles, 
  Download, 
  MessageSquare, 
  Code2,
  Lightbulb,
  CheckCircle2
} from "lucide-react";

export default function VibeCodingGuidePage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/guide">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            가이드로 돌아가기
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <h1 className="text-3xl font-bold">바이브 코딩이란?</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            AI와 대화하며 코딩하는 새로운 개발 방식을 배워보세요
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {/* Section 1 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                바이브 코딩 소개
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>바이브 코딩(Vibe Coding)</strong>은 AI와 자연어로 대화하며 
                코드를 작성하는 새로운 개발 방식입니다. 복잡한 프로그래밍 언어 문법을 
                몰라도, 원하는 것을 말로 설명하면 AI가 코드를 작성해줍니다.
              </p>
              <p>
                마치 경험 많은 개발자와 페어 프로그래밍을 하는 것처럼, 
                AI에게 질문하고 피드백을 주고받으며 프로젝트를 진행할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Cursor IDE 설치하기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                바이브 코딩을 위해 <strong>Cursor IDE</strong>를 사용합니다. 
                Cursor는 AI가 내장된 코드 에디터로, 채팅을 통해 코드를 작성하고 
                수정할 수 있습니다.
              </p>
              
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-semibold mb-2">설치 방법:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline">
                      cursor.sh
                    </a>에 접속합니다
                  </li>
                  <li>운영체제에 맞는 설치 파일을 다운로드합니다</li>
                  <li>설치 파일을 실행하여 설치를 완료합니다</li>
                  <li>Cursor를 실행하고 계정을 생성합니다</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                AI와 대화하기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Cursor에서 AI와 대화하는 방법은 간단합니다. 
                <kbd className="px-2 py-1 bg-muted rounded text-sm mx-1">Ctrl + K</kbd> 
                또는 
                <kbd className="px-2 py-1 bg-muted rounded text-sm mx-1">Ctrl + L</kbd>
                을 누르면 AI 채팅창이 열립니다.
              </p>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">좋은 프롬프트 예시:</h4>
                <div className="space-y-3">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">좋은 예시</p>
                        <p className="text-sm text-muted-foreground">
                          &quot;이메일과 비밀번호를 입력받는 로그인 폼을 만들어줘. 
                          유효성 검사도 추가하고, 에러 메시지도 표시해줘&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">피해야 할 예시</p>
                        <p className="text-sm text-muted-foreground">
                          &quot;로그인 만들어줘&quot; (너무 모호함)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                프롬프트 작성 팁
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">1</span>
                  <div>
                    <strong>구체적으로 설명하세요</strong>
                    <p className="text-sm text-muted-foreground">
                      원하는 기능, 디자인, 동작을 자세히 설명할수록 더 정확한 결과를 얻을 수 있습니다.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">2</span>
                  <div>
                    <strong>컨텍스트를 제공하세요</strong>
                    <p className="text-sm text-muted-foreground">
                      현재 프로젝트 상황, 사용 중인 기술 스택 등을 알려주면 더 적합한 코드를 생성합니다.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">3</span>
                  <div>
                    <strong>단계별로 진행하세요</strong>
                    <p className="text-sm text-muted-foreground">
                      복잡한 기능은 작은 단위로 나누어 요청하면 더 좋은 결과를 얻을 수 있습니다.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">4</span>
                  <div>
                    <strong>피드백을 주세요</strong>
                    <p className="text-sm text-muted-foreground">
                      결과가 마음에 들지 않으면 수정사항을 구체적으로 요청하세요.
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex gap-4">
            <Link href="/guide/tdd">
              <Button variant="outline" className="gap-2">
                다음: TDD 방법론
                <Code2 className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/wizard">
              <Button className="gap-2">
                <Sparkles className="h-4 w-4" />
                프로젝트 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

