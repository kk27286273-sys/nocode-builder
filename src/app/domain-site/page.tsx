import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cache } from 'react';
import { findDomain, getPublication } from '@/lib/public-sites';
import { requestHost, isPlatformHost } from '@/lib/site-policy';
import SiteViewerClient from '@/components/SiteViewerClient';

export const dynamic = 'force-dynamic';
const load = cache(async () => {
  const host = requestHost({ headers: new Headers(await headers()) });
  if (process.env.CUSTOM_DOMAINS_ENABLED !== 'true' || isPlatformHost(host)) return null;
  const domain = await findDomain(host);
  if (!domain) return null;
  const site = await getPublication(domain.site_id);
  return site ? { domain, site } : null;
});

export async function generateMetadata(): Promise<Metadata> {
  const result = await load(); if (!result) return { robots: { index: false } };
  const { site, domain } = result;
  const title = site.data?.company?.name || '공식 홈페이지';
  const description = site.data?.hero?.subtitle || '';
  return { metadataBase: new URL(`https://${domain.domain}`), title: { absolute: title }, description,
    applicationName: title, alternates: { canonical: '/' }, openGraph: { title, description, siteName: title, url: '/', images: [] },
    twitter: { title, description, images: [] } };
}
export default async function DomainPage() {
  const result = await load(); if (!result) notFound();
  return <SiteViewerClient data={result.site.data} />;
}
