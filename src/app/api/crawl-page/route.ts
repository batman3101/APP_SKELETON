import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

interface ColorInfo {
  hex: string;
  property: string;
  count: number;
}

interface FontInfo {
  fontFamily: string;
  count: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL이 필요합니다" },
        { status: 400 }
      );
    }

    // Fetch the page
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract inline styles and style tags
    const styles: string[] = [];
    
    // Get style tags
    $("style").each((_, el) => {
      styles.push($(el).text());
    });

    // Get link tags for external CSS
    const cssLinks: string[] = [];
    $('link[rel="stylesheet"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href) {
        cssLinks.push(href.startsWith("http") ? href : new URL(href, url).href);
      }
    });

    // Fetch external CSS (limited to first 3)
    const externalStyles = await Promise.all(
      cssLinks.slice(0, 3).map(async (link) => {
        try {
          const cssResponse = await axios.get(link, { timeout: 5000 });
          return cssResponse.data;
        } catch {
          return "";
        }
      })
    );
    
    styles.push(...externalStyles);
    const allCss = styles.join("\n");

    // Extract colors
    const colorRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b|rgb\([^)]+\)|rgba\([^)]+\)/g;
    const colors: Map<string, ColorInfo> = new Map();
    
    const colorMatches = allCss.match(colorRegex) || [];
    colorMatches.forEach((color) => {
      const hex = normalizeColor(color);
      if (hex) {
        const existing = colors.get(hex);
        if (existing) {
          existing.count++;
        } else {
          colors.set(hex, { hex, property: "various", count: 1 });
        }
      }
    });

    // Extract fonts
    const fontRegex = /font-family:\s*([^;]+)/gi;
    const fonts: Map<string, FontInfo> = new Map();
    
    let fontMatch;
    while ((fontMatch = fontRegex.exec(allCss)) !== null) {
      const fontFamily = fontMatch[1].trim().replace(/['"]/g, "").split(",")[0].trim();
      if (fontFamily) {
        const existing = fonts.get(fontFamily);
        if (existing) {
          existing.count++;
        } else {
          fonts.set(fontFamily, { fontFamily, count: 1 });
        }
      }
    }

    // Sort by usage count
    const sortedColors = Array.from(colors.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const sortedFonts = Array.from(fonts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Generate Tailwind config
    const tailwindConfig = generateTailwindConfig(sortedColors);
    
    // Generate CSS variables
    const cssVariables = generateCSSVariables(sortedColors);

    // Generate AI prompt
    const aiPrompt = generateDesignPrompt(sortedColors, sortedFonts);

    return NextResponse.json({
      url,
      colors: sortedColors.map((c) => ({
        hex: c.hex,
        name: getColorName(c.hex),
        usage: `${c.count}회 사용`,
      })),
      fonts: sortedFonts.map((f) => ({
        fontFamily: f.fontFamily,
        usage: `${f.count}회 사용`,
      })),
      tailwindConfig,
      cssVariables,
      aiPrompt,
    });
  } catch (error: unknown) {
    console.error("Crawl error:", error);
    const errorMessage = error instanceof Error ? error.message : "크롤링 중 오류가 발생했습니다";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

function normalizeColor(color: string): string | null {
  if (color.startsWith("#")) {
    if (color.length === 4) {
      // Convert #RGB to #RRGGBB
      return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`.toUpperCase();
    }
    return color.toUpperCase();
  }
  
  // Handle rgb/rgba
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, "0");
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, "0");
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`.toUpperCase();
  }
  
  return null;
}

function getColorName(hex: string): string {
  // Simple color naming based on hue
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;
  
  if (max === min) {
    if (l < 0.2) return "검정";
    if (l > 0.8) return "흰색";
    return "회색";
  }
  
  let h = 0;
  const d = max - min;
  
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  
  if (h < 0.05 || h > 0.95) return "빨강";
  if (h < 0.12) return "주황";
  if (h < 0.2) return "노랑";
  if (h < 0.45) return "초록";
  if (h < 0.55) return "청록";
  if (h < 0.7) return "파랑";
  if (h < 0.8) return "보라";
  return "분홍";
}

function generateTailwindConfig(colors: ColorInfo[]): string {
  const colorConfig = colors
    .slice(0, 5)
    .map((c, i) => `    'custom-${i + 1}': '${c.hex}',`)
    .join("\n");
  
  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
${colorConfig}
      },
    },
  },
}`;
}

function generateCSSVariables(colors: ColorInfo[]): string {
  const variables = colors
    .slice(0, 5)
    .map((c, i) => `  --color-${i + 1}: ${c.hex};`)
    .join("\n");
  
  return `:root {
${variables}
}`;
}

function generateDesignPrompt(colors: ColorInfo[], fonts: FontInfo[]): string {
  const colorDesc = colors
    .slice(0, 3)
    .map((c) => `${getColorName(c.hex)} (${c.hex})`)
    .join(", ");
  
  const fontDesc = fonts
    .slice(0, 2)
    .map((f) => f.fontFamily)
    .join(", ");
  
  return `이 디자인은 ${colorDesc} 색상을 주로 사용합니다. ${fontDesc ? `폰트는 ${fontDesc}를 사용합니다.` : ""} 모던하고 깔끔한 디자인 스타일을 따르며, 이 색상 팔레트와 스타일을 유지하면서 UI를 구현해주세요.`;
}

