import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  TestTube, 
  AlertCircle, 
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Code2
} from "lucide-react";

export default function TDDGuidePage() {
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
            <div className="p-3 rounded-lg bg-green-500/10">
              <TestTube className="h-6 w-6 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold">TDD 방법론</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            테스트 주도 개발로 안정적인 코드를 작성하는 방법을 배워보세요
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-primary" />
                TDD란 무엇인가요?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>TDD(Test-Driven Development, 테스트 주도 개발)</strong>는 
                코드를 작성하기 전에 먼저 테스트를 작성하는 개발 방법론입니다.
              </p>
              <p>
                처음에는 낯설 수 있지만, TDD를 사용하면 버그를 조기에 발견하고 
                코드의 품질을 높일 수 있습니다. 바이브 코딩과 함께 사용하면 
                AI가 생성한 코드가 올바르게 동작하는지 확인할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 - Red Green Refactor */}
          <Card>
            <CardHeader>
              <CardTitle>Red-Green-Refactor 사이클</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                TDD는 세 단계의 반복적인 사이클로 진행됩니다:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Red */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <h4 className="font-semibold text-red-600 dark:text-red-400">1. RED</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    실패하는 테스트를 먼저 작성합니다. 아직 기능이 구현되지 않았으므로 
                    테스트는 실패합니다 (빨간색).
                  </p>
                </div>

                {/* Green */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <h4 className="font-semibold text-green-600 dark:text-green-400">2. GREEN</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    테스트를 통과하는 최소한의 코드를 작성합니다. 
                    코드가 완벽하지 않아도 괜찮습니다 (초록색).
                  </p>
                </div>

                {/* Refactor */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <RefreshCw className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">3. REFACTOR</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    테스트가 통과하는 상태를 유지하면서 코드를 개선합니다. 
                    중복을 제거하고 가독성을 높입니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3 - Example */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                테스트 코드 예시
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                간단한 로그인 기능에 대한 테스트 예시입니다:
              </p>
              
              <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm">
{`// login.test.ts
describe('로그인 기능', () => {
  it('유효한 이메일과 비밀번호로 로그인 성공', async () => {
    // Given: 유효한 사용자 정보
    const email = 'user@example.com';
    const password = 'validPassword123';

    // When: 로그인 시도
    const result = await login(email, password);

    // Then: 성공 응답
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
  });

  it('잘못된 비밀번호로 로그인 실패', async () => {
    // Given: 잘못된 비밀번호
    const email = 'user@example.com';
    const password = 'wrongPassword';

    // When: 로그인 시도
    const result = await login(email, password);

    // Then: 실패 응답
    expect(result.success).toBe(false);
    expect(result.error).toBe('비밀번호가 틀렸습니다');
  });
});`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 - AI와 TDD */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI와 함께 TDD하기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                바이브 코딩에서 TDD를 활용하면 AI가 생성한 코드의 품질을 
                더욱 높일 수 있습니다. 다음과 같이 AI에게 요청해보세요:
              </p>

              <div className="space-y-3">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">예시 프롬프트 1:</p>
                  <p className="text-sm text-muted-foreground">
                    &quot;로그인 기능에 대한 테스트 코드를 먼저 작성해줘. 
                    성공 케이스와 실패 케이스 모두 포함해줘&quot;
                  </p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">예시 프롬프트 2:</p>
                  <p className="text-sm text-muted-foreground">
                    &quot;이 테스트를 통과하는 login 함수를 구현해줘. 
                    최소한의 코드로 작성해줘&quot;
                  </p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">예시 프롬프트 3:</p>
                  <p className="text-sm text-muted-foreground">
                    &quot;이 코드를 리팩토링해줘. 중복을 제거하고 가독성을 높여줘. 
                    테스트는 계속 통과해야 해&quot;
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5 - Tips */}
          <Card>
            <CardHeader>
              <CardTitle>초보자를 위한 TDD 팁</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">1</span>
                  <div>
                    <strong>작은 것부터 시작하세요</strong>
                    <p className="text-sm text-muted-foreground">
                      처음부터 모든 것을 테스트하려 하지 마세요. 핵심 기능부터 시작하세요.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">2</span>
                  <div>
                    <strong>하나의 테스트에 하나의 기능</strong>
                    <p className="text-sm text-muted-foreground">
                      각 테스트는 하나의 동작만 검증해야 합니다.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">3</span>
                  <div>
                    <strong>테스트 이름은 명확하게</strong>
                    <p className="text-sm text-muted-foreground">
                      테스트 이름만 보고도 무엇을 테스트하는지 알 수 있어야 합니다.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">4</span>
                  <div>
                    <strong>AI에게 도움을 요청하세요</strong>
                    <p className="text-sm text-muted-foreground">
                      테스트 작성이 어려우면 AI에게 테스트 케이스를 제안해달라고 요청하세요.
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex gap-4">
            <Link href="/guide/vibe-coding">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                이전: 바이브 코딩이란?
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

