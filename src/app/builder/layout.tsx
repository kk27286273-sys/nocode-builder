import '../globals.css';

export const metadata = {
  title: 'TH소프트 B2B 웹 빌더 스튜디오',
  description: '웹사이트 제작 및 편집 관리자',
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased bg-slate-900 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
