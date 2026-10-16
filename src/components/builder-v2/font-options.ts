import type { V2FontFamily } from "@/types/builder-v2";

export const V2_FONT_OPTIONS: {
  label: string;
  value: V2FontFamily;
}[] = [
  {
    label: "시스템 기본",
    value: "system",
  },
  {
    label: "고딕체",
    value: "sans",
  },
  {
    label: "명조체",
    value: "serif",
  },
  {
    label: "고정폭",
    value: "mono",
  },
];

export const V2_FONT_FAMILIES: Record<V2FontFamily, string> = {
  system:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  sans: "Arial, Helvetica, sans-serif",
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"Courier New", Courier, monospace',
};