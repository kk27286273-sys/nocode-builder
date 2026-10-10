import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { ReactNode } from 'react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const supabase = createAdminClient();
    const { data: siteRecord } = await supabase
      .from('sites')
      .select('data')
      .eq('id', id)
      .single();

    if (!siteRecord?.data) {
      return {
        title: 'first project',
        description: '기업 홈페이지 빌더',
      };
    }

    const content = siteRecord.data;
    const companyName = content?.company?.name || 'first project';
    const heroTitle = content?.hero?.title || companyName;
    const heroSubtitle = content?.hero?.subtitle || '기업 홈페이지';
    
    const description = `${companyName} - ${heroSubtitle}`.slice(0, 155);

    return {
      title: `${heroTitle} | ${companyName}`,
      description,
      openGraph: {
        title: `${heroTitle} | ${companyName}`,
        description,
        type: 'website',
        siteName: companyName,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${heroTitle} | ${companyName}`,
        description,
      },
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return {
      title: 'first project',
      description: '기업 홈페이지 빌더',
    };
  }
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}