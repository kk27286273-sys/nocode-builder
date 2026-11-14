import type { Metadata } from 'next';
import { headers } from 'next/headers';
import PreviewClient from './PreviewClient';
import MedinsurePublicInfo from '@/components/home/MedinsurePublicInfo';
import { medinsureMetadata, medinsureDescription, verificationMetadata } from '@/lib/medinsure/seo';
export async function generateMetadata({params}: {params: Promise<{siteId: string}>}): Promise<Metadata> {
  const {siteId} = await params;
  if (siteId !== 'medinsure') return {};
  const metadata = { ...medinsureMetadata('메딘슈어 | MedinSure — 보험설계사 업무 지원 프로그램', medinsureDescription), verification: verificationMetadata() };
  const host = (await headers()).get('host')?.split(':')[0].toLowerCase();
  if (host === 'medinsure.co.kr' || host === 'www.medinsure.co.kr') {
    const description = '메딘슈어는 보험설계사를 위한 병력분석 프로그램입니다. 진료내역 분석, 고객·보험 관리, 보장 비교분석과 리포트 작성을 지원합니다.';
    return { ...metadata, description, openGraph: { ...metadata.openGraph, description } };
  }
  return metadata;
}
export default async function PreviewPage({params}: {params: Promise<{siteId:string}>}) {
  const {siteId} = await params;
  return <><PreviewClient />{siteId === 'medinsure' && <MedinsurePublicInfo />}</>;
}
