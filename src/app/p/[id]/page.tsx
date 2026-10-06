import { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase/admin';
import ViewerClient from './ViewerClient';

interface Props {
  params: Promise<{ id: string }>;
}

// 1. [5번 과제] 동적 메타데이터 & 카카오톡/SNS OG 태그 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const { data: site } = await supabaseAdmin
      .from('sites')
      .select('title, content')
      .eq('id', id)
      .single();

    if (!site || !site.content) {
      return {
        title: 'B2B 기업 웹사이트',
        description: '비즈니스 성장 솔루션을 확인해보세요.',
      };
    }

    const content = site.content;
    const title = content?.hero?.title || site.title || 'B2B 공식 홈페이지';
    const description = content?.hero?.subtitle || '비즈니스 상담 및 솔루션 안내';
    const companyName = content?.company?.name || '공식 웹사이트';
    const ogImage = content?.company?.logoUrl || '/og-default.png';

    return {
      title: `${companyName} | ${title}`,
      description,
      openGraph: {
        title: `${companyName} - ${title}`,
        description,
        images: [{ url: ogImage }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${companyName} - ${title}`,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    return {
      title: 'B2B 기업 웹사이트',
      description: '비즈니스 상담 신청',
    };
  }
}

// 2. 서버 컴포넌트 렌더러
export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ViewerClient siteId={id} />;
}