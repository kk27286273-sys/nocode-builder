export type V2ElementType = "heading" | "text" | "image" | "button";

export interface V2Element {
  id: string;
  type: V2ElementType;
  content: string;
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
  sections: V2Section[];
}
