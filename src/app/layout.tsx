import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

import KakaoChatButton from '@/components/KakaoChatButton';
import GlobalFooter from '@/components/GlobalFooter';

export const metadata: Metadata = {
  metadataBase: new URL('https://thsoft.co.kr'),

  title: {
    default: 'NEXIA | THsoft 공식 웹사이트 제작·관리 서비스',
    template: '%s | NEXIA',
  },

  description:
    'NEXIA는 THsoft가 운영하는 사업자용 웹사이트 제작·관리 서비스입니다. 업종별 템플릿, 반응형 홈페이지 제작, 유지보수를 제공합니다.',

  applicationName: 'NEXIA',

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://thsoft.co.kr/',
    siteName: 'NEXIA',
    title: 'NEXIA | THsoft 공식 웹사이트 제작·관리 서비스',
    description:
      '사업자를 위한 반응형 홈페이지 제작·관리 서비스. NEXIA는 THsoft가 운영합니다.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NEXIA - THsoft 공식 웹사이트 제작·관리 서비스',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'NEXIA | THsoft 공식 웹사이트 제작·관리 서비스',
    description:
      '사업자를 위한 반응형 홈페이지 제작·관리 서비스. NEXIA는 THsoft가 운영합니다.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}

        <GlobalFooter />

        <KakaoChatButton />
      </body>
    </html>
  );
}