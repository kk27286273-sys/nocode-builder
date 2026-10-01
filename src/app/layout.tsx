import type { Metadata } from 'next';
import './globals.css'; // <- 이 줄이 빠져서 스타일이 전부 풀렸던 것입니다!
import KakaoChatButton from '@/components/KakaoChatButton';

export const metadata: Metadata = {
  title: '기업 전문 웹사이트 제작 | TH소프트',
  description: '구미 공단 B2B 맞춤형 원페이지 기업 홈페이지 제작',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <KakaoChatButton />
      </body>
    </html>
  );
}