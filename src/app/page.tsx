import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  FileText, 
  Palette, 
  CheckSquare, 
  BookOpen,
  ArrowRight,
  Wand2,
  Code2,
  Layers
} from "lucide-react";

const features = [
  {
    icon: Wand2,
    title: "AI 문서 자동 생성",
    description: "아이디어만 입력하면 기획문서, PRD, TRD, TDD, TODO를 AI가 자동으로 생성합니다.",
    href: "/wizard",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Palette,
    title: "UI/테마 캡처",
    description: "마음에 드는 웹사이트의 디자인을 캡처하여 디자인 가이드로 변환합니다.",
    href: "/theme-capture",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: CheckSquare,
    title: "TODO 관리",
    description: "칸반, 체크리스트, 타임라인 뷰로 프로젝트 진행도를 시각적으로 관리합니다.",
    href: "/dashboard",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: BookOpen,
    title: "바이브 코딩 가이드",
    description: "Cursor IDE 사용법부터 AI와 대화하는 방법까지 상세히 안내합니다.",
    href: "/guide",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

const steps = [
  {
    step: 1,
    icon: Sparkles,
    title: "아이디어 입력",
    description: "만들고 싶은 앱에 대해 설명하세요",
  },
  {
    step: 2,
    icon: FileText,
    title: "문서 생성",
    description: "AI가 필요한 모든 문서를 생성합니다",
  },
  {
    step: 3,
    icon: Code2,
    title: "바이브 코딩",
    description: "생성된 문서로 Cursor와 함께 개발하세요",
  },
  {
    step: 4,
    icon: Layers,
    title: "앱 완성",
    description: "체계적인 진행으로 앱을 완성하세요",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="container relative">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              코딩 경험이 없어도 괜찮아요
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                바이브 코딩
              </span>
              으로
              <br />
              앱 개발을 시작하세요
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
              아이디어만 있으면 됩니다. AI가 기획문서부터 개발 가이드까지 
              모든 것을 준비해드립니다. 지금 바로 당신의 첫 앱을 만들어보세요.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/wizard">
                <Button size="lg" className="gap-2 text-lg px-8">
                  프로젝트 시작하기
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/guide">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                  <BookOpen className="h-5 w-5" />
                  가이드 보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">어떻게 작동하나요?</h2>
            <p className="text-muted-foreground text-lg">
              4단계만 따라하면 앱 개발을 시작할 수 있습니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -top-2 -left-2 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">주요 기능</h2>
            <p className="text-muted-foreground text-lg">
              바이브 코딩에 필요한 모든 도구를 제공합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.href} href={feature.href}>
                  <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/50">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="flex items-center gap-2">
                        {feature.title}
                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                      </CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="container">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              코딩 경험이 없어도 괜찮습니다. AI와 함께라면 누구나 앱을 만들 수 있습니다.
            </p>
            <Link href="/wizard">
              <Button size="lg" className="gap-2 text-lg px-8">
                무료로 시작하기
                <Sparkles className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">바이브 코딩 가이드</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 바이브 코딩 가이드. 모든 데이터는 로컬에 저장됩니다.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
