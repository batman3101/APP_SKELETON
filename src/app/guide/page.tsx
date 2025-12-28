import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Code2, 
  TestTube, 
  MessageSquare,
  ArrowRight,
  BookOpen,
  Lightbulb,
  Zap
} from "lucide-react";

const guides = [
  {
    href: "/guide/vibe-coding",
    icon: Sparkles,
    title: "바이브 코딩이란?",
    description: "AI와 대화하며 코딩하는 새로운 개발 방식에 대해 알아보세요",
    topics: ["Cursor IDE 소개", "AI 페어 프로그래밍", "프롬프트 작성법"],
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    href: "/guide/tdd",
    icon: TestTube,
    title: "TDD 방법론",
    description: "테스트 주도 개발로 안정적인 코드를 작성하는 방법을 배워보세요",
    topics: ["TDD 개념", "Red-Green-Refactor", "테스트 코드 작성"],
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

const tips = [
  {
    icon: MessageSquare,
    title: "명확하게 설명하기",
    description: "AI에게 원하는 것을 구체적이고 명확하게 설명하세요",
  },
  {
    icon: Code2,
    title: "작은 단위로 요청하기",
    description: "한 번에 하나의 기능에 집중하여 요청하세요",
  },
  {
    icon: Lightbulb,
    title: "예시 제공하기",
    description: "원하는 결과물의 예시를 함께 제공하면 더 정확한 결과를 얻을 수 있습니다",
  },
  {
    icon: Zap,
    title: "반복적으로 개선하기",
    description: "첫 번째 결과가 완벽하지 않아도 괜찮습니다. 피드백을 주며 개선하세요",
  },
];

export default function GuidePage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            초보자 가이드
          </div>
          <h1 className="text-3xl font-bold mb-4">바이브 코딩 가이드</h1>
          <p className="text-muted-foreground text-lg">
            코딩 경험이 없어도 AI와 함께라면 앱을 만들 수 있습니다.
            <br />
            이 가이드를 통해 바이브 코딩의 핵심을 익혀보세요.
          </p>
        </div>

        {/* Main Guides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link key={guide.href} href={guide.href}>
                <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${guide.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${guide.color}`} />
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      {guide.title}
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </CardTitle>
                    <CardDescription className="text-base">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {guide.topics.map((topic) => (
                        <span
                          key={topic}
                          className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">AI와 대화하는 팁</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tips.map((tip) => {
              const Icon = tip.icon;
              return (
                <Card key={tip.title} className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{tip.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-0">
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                준비되셨나요?
              </h3>
              <p className="text-muted-foreground mb-6">
                이제 직접 프로젝트를 시작해보세요
              </p>
              <Link href="/wizard">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  프로젝트 시작하기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

