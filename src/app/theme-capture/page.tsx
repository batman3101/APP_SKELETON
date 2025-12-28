"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Link as LinkIcon, 
  Palette, 
  Code, 
  MessageSquare,
  Loader2,
  Image as ImageIcon,
  Copy,
  Check,
  AlertCircle,
  X,
  Sparkles
} from "lucide-react";
import { useAIConfigStore } from "@/stores/aiConfigStore";

interface ColorInfo {
  hex: string;
  name: string;
  usage: string;
}

interface FontInfo {
  fontFamily: string;
  usage: string;
}

interface AnalysisResult {
  colors: ColorInfo[];
  fonts?: FontInfo[];
  typography?: Array<{
    fontFamily: string;
    fontSize?: string;
    fontWeight?: string;
    usage: string;
  }>;
  tailwindConfig: string;
  cssVariables: string;
  aiPrompt: string;
  layoutStyle?: string;
  designCharacteristics?: string[];
}

export default function ThemeCapturePage() {
  const { apiKey, aiProvider, isConfigured } = useAIConfigStore();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("screenshot");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL 크롤링 분석
  const handleUrlSubmit = async () => {
    if (!url) {
      setError("URL을 입력해주세요");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/crawl-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "크롤링 중 오류가 발생했습니다");
      }

      setResult({
        colors: data.colors || [],
        fonts: data.fonts || [],
        tailwindConfig: data.tailwindConfig || "",
        cssVariables: data.cssVariables || "",
        aiPrompt: data.aiPrompt || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("파일 크기는 10MB 이하여야 합니다");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setUploadedImage(base64);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  // 파일 드롭 핸들러
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // 스크린샷 분석 (AI Vision)
  const handleScreenshotAnalysis = async () => {
    if (!uploadedImage) {
      setError("이미지를 먼저 업로드해주세요");
      return;
    }

    if (!isConfigured) {
      setError("먼저 AI 설정에서 API 키를 입력해주세요 (상단 'AI 설정' 버튼)");
      return;
    }

    if (aiProvider !== "openai") {
      setError("스크린샷 분석은 현재 OpenAI(GPT-4 Vision)만 지원합니다");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // base64에서 data URL prefix 제거
      const base64Data = uploadedImage.split(",")[1];

      const response = await fetch("/api/analyze-screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          imageBase64: base64Data,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "분석 중 오류가 발생했습니다");
      }

      setResult({
        colors: data.colors || [],
        typography: data.typography || [],
        tailwindConfig: data.tailwindConfig || "",
        cssVariables: data.cssVariables || "",
        aiPrompt: data.aiPrompt || "",
        layoutStyle: data.layoutStyle,
        designCharacteristics: data.designCharacteristics,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // 클립보드 복사
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setError("클립보드 복사에 실패했습니다");
    }
  };

  // 이미지 제거
  const removeImage = () => {
    setUploadedImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

        {/* AI 설정 안내 */}
        {!isConfigured && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">스크린샷 분석을 위해 AI 설정이 필요합니다</span>
            </div>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
              상단의 &quot;AI 설정 필요&quot; 버튼을 클릭하여 OpenAI API 키를 입력해주세요.
              URL 분석은 API 키 없이 사용 가능합니다.
            </p>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  <CardContent className="space-y-4">
                    {uploadedImage ? (
                      <div className="relative">
                        <img
                          src={uploadedImage}
                          alt="업로드된 스크린샷"
                          className="w-full h-auto rounded-lg border"
                        />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">
                          이미지를 드래그하거나 클릭하여 업로드
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, WEBP (최대 10MB)
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </div>
                    )}

                    <Button
                      className="w-full"
                      onClick={handleScreenshotAnalysis}
                      disabled={!uploadedImage || isLoading || !isConfigured}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          AI 분석 중...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          AI로 디자인 분석하기
                        </>
                      )}
                    </Button>
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
                        onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                      />
                      <Button onClick={handleUrlSubmit} disabled={isLoading || !url}>
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
                    <p className="text-xs text-green-600 dark:text-green-400">
                      ✓ URL 분석은 API 키 없이 사용 가능합니다
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
                {result ? (
                  <Tabs defaultValue="colors" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="colors" className="gap-1 text-xs">
                        <Palette className="h-3 w-3" />
                        색상
                      </TabsTrigger>
                      <TabsTrigger value="tailwind" className="gap-1 text-xs">
                        <Code className="h-3 w-3" />
                        Tailwind
                      </TabsTrigger>
                      <TabsTrigger value="css" className="gap-1 text-xs">
                        <Code className="h-3 w-3" />
                        CSS
                      </TabsTrigger>
                      <TabsTrigger value="prompt" className="gap-1 text-xs">
                        <MessageSquare className="h-3 w-3" />
                        프롬프트
                      </TabsTrigger>
                    </TabsList>

                    {/* 색상 탭 */}
                    <TabsContent value="colors" className="mt-4">
                      <ScrollArea className="h-[350px]">
                        <div className="space-y-4">
                          <h4 className="font-medium text-sm">추출된 색상</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {result.colors.map((color, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 p-2 rounded-lg border"
                              >
                                <div
                                  className="w-8 h-8 rounded-md border shadow-sm"
                                  style={{ backgroundColor: color.hex }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-mono">{color.hex}</p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {color.name}
                                  </p>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => copyToClipboard(color.hex, `color-${i}`)}
                                >
                                  {copiedField === `color-${i}` ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>

                          {(result.fonts || result.typography) && (
                            <>
                              <h4 className="font-medium text-sm mt-6">폰트</h4>
                              <div className="space-y-2">
                                {(result.fonts || result.typography)?.map((font, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between p-2 rounded-lg border"
                                  >
                                    <span className="text-sm font-medium">
                                      {font.fontFamily}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {font.usage}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          {result.designCharacteristics && (
                            <>
                              <h4 className="font-medium text-sm mt-6">디자인 특징</h4>
                              <div className="flex flex-wrap gap-2">
                                {result.designCharacteristics.map((char, i) => (
                                  <Badge key={i} variant="secondary">
                                    {char}
                                  </Badge>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    {/* Tailwind 탭 */}
                    <TabsContent value="tailwind" className="mt-4">
                      <div className="relative">
                        <ScrollArea className="h-[350px]">
                          <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                            <code>{result.tailwindConfig}</code>
                          </pre>
                        </ScrollArea>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(result.tailwindConfig, "tailwind")}
                        >
                          {copiedField === "tailwind" ? (
                            <>
                              <Check className="h-3 w-3 mr-1 text-green-500" />
                              복사됨
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              복사
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    {/* CSS 탭 */}
                    <TabsContent value="css" className="mt-4">
                      <div className="relative">
                        <ScrollArea className="h-[350px]">
                          <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                            <code>{result.cssVariables}</code>
                          </pre>
                        </ScrollArea>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(result.cssVariables, "css")}
                        >
                          {copiedField === "css" ? (
                            <>
                              <Check className="h-3 w-3 mr-1 text-green-500" />
                              복사됨
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              복사
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    {/* 프롬프트 탭 */}
                    <TabsContent value="prompt" className="mt-4">
                      <div className="relative">
                        <ScrollArea className="h-[350px]">
                          <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm whitespace-pre-wrap">{result.aiPrompt}</p>
                          </div>
                        </ScrollArea>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(result.aiPrompt, "prompt")}
                        >
                          {copiedField === "prompt" ? (
                            <>
                              <Check className="h-3 w-3 mr-1 text-green-500" />
                              복사됨
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              복사
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="min-h-[350px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>이미지나 URL을 입력하면</p>
                      <p>디자인 분석 결과가 표시됩니다</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
