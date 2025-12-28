"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Link as LinkIcon, 
  Palette, 
  Code, 
  MessageSquare,
  Loader2,
  Image as ImageIcon
} from "lucide-react";

export default function ThemeCapturePage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlSubmit = async () => {
    if (!url) return;
    setIsLoading(true);
    // TODO: Implement URL crawling
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">UI/테마 캡처</h1>
          <p className="text-muted-foreground">
            마음에 드는 웹사이트의 디자인을 캡처하여 프로젝트에 활용하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Tabs defaultValue="screenshot" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="screenshot" className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  스크린샷 업로드
                </TabsTrigger>
                <TabsTrigger value="url" className="gap-2">
                  <LinkIcon className="h-4 w-4" />
                  URL 입력
                </TabsTrigger>
              </TabsList>

              <TabsContent value="screenshot" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">스크린샷 업로드</CardTitle>
                    <CardDescription>
                      웹사이트 스크린샷을 업로드하면 AI가 디자인을 분석합니다
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        이미지를 드래그하거나 클릭하여 업로드
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, WEBP (최대 10MB)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="url" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">URL 입력</CardTitle>
                    <CardDescription>
                      웹사이트 URL을 입력하면 CSS와 디자인 요소를 추출합니다
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleUrlSubmit} disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "분석"
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      * CORS 정책에 따라 일부 사이트는 분석이 제한될 수 있습니다
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">분석 결과</CardTitle>
                <CardDescription>
                  추출된 디자인 정보를 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="guide" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="guide" className="gap-1 text-xs">
                      <Palette className="h-3 w-3" />
                      디자인 가이드
                    </TabsTrigger>
                    <TabsTrigger value="code" className="gap-1 text-xs">
                      <Code className="h-3 w-3" />
                      CSS 코드
                    </TabsTrigger>
                    <TabsTrigger value="prompt" className="gap-1 text-xs">
                      <MessageSquare className="h-3 w-3" />
                      AI 프롬프트
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="guide" className="mt-4">
                    <div className="min-h-[300px] flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>이미지나 URL을 입력하면</p>
                        <p>디자인 가이드가 생성됩니다</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="mt-4">
                    <div className="min-h-[300px] flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>CSS/Tailwind 코드가</p>
                        <p>여기에 표시됩니다</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="prompt" className="mt-4">
                    <div className="min-h-[300px] flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>AI에게 전달할 디자인 프롬프트가</p>
                        <p>여기에 표시됩니다</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

