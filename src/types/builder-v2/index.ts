export interface V2Element {
  id: string;
  type: "heading" | "text" | "image" | "button" | "video";
  content: string;
  metadata?: Record<string, any>;
  alt?: string;
}

export interface V2Section {
  id: string;
  name: string;
  type?: "hero" | "gallery" | "services" | "process" | "contact" | "footer";
  elements: V2Element[];
}

export interface V2Page {
  id: string;
  name: string;
  slug: string;
  templateType: string;
  sections: V2Section[];
}

const initialPages: V2Page[] = [
  {
    id: "home",
    name: "메인",
    slug: "/",
    templateType: "interior",
    sections: [
      {
        id: "hero",
        name: "메인 배너",
        type: "hero",
        elements: [
          {
            id: "hero-title",
            type: "heading",
            content: "새로운 홈페이지를 시작하세요",
          },
          {
            id: "hero-description",
            type: "text",
            content:
              "Nexia Builder V2에서 쉽고 빠르게 홈페이지를 만드세요.",
          },
          {
            id: "hero-button",
            type: "button",
            content: "문의하기",
          },
        ],
      },
      {
        id: "about",
        name: "회사 소개",
        type: "services",
        elements: [
          {
            id: "about-title",
            type: "heading",
            content: "회사 소개",
          },
          {
            id: "about-description",
            type: "text",
            content: "고객에게 회사의 강점과 이야기를 소개하세요.",
          },
        ],
      },
    ],
  },
  {
    id: "contact",
    name: "고객센터",
    slug: "/contact",
    templateType: "interior",
    sections: [
      {
        id: "contact-info",
        name: "연락처",
        type: "contact",
        elements: [
          {
            id: "contact-title",
            type: "heading",
            content: "문의해 주세요",
          },
          {
            id: "contact-description",
            type: "text",
            content: "전화번호와 이메일을 입력할 수 있는 영역입니다.",
          },
        ],
      },
    ],
  },
];

export default initialPages;