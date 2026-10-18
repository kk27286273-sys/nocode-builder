// src/types/builder-v2/index.tsx

export type V2FontFamily = "system" | "sans" | "serif" | "mono";

export type V2ElementType = "heading" | "text" | "image" | "button" | "video";

export interface V2Element {
  id: string;
  type: V2ElementType;
  content: string;
  fontFamily?: V2FontFamily;
  metadata?: {
    // 갤러리 이미지용
    title?: string;
    description?: string;
    area?: string;
    duration?: string;
    tags?: string[];
    beforeImage?: string;
    category?: string;
    result?: string;
    [key: string]: any;
  };
  alt?: string; // 이미지 alt 텍스트
}

export interface V2Section {
  id: string;
  name: string;
  elements: V2Element[];
}

export interface V2Page {
  id: string;
  name: string;
  slug: string;
  templateType?: "interior" | "legal" | "fitness" | "corporate"; // 추가
  sections: V2Section[];
}