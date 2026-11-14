import type { Metadata } from 'next';
import PreviewClient from './PreviewClient';
import MedinsurePublicInfo from '@/components/home/MedinsurePublicInfo';
import { medinsureMetadata, medinsureDescription, verificationMetadata } from '@/lib/medinsure/seo';
export async function generateMetadata({params}: {params: Promise<{siteId: string}>}): Promise<Metadata> {
  const {siteId} = await params;
  return siteId === 'medinsure' ? { ...medinsureMetadata('메딘슈어 | MedinSure — 보험설계사 업무 지원 프로그램', medinsureDescription), verification: verificationMetadata() } : {};
}
export default async function PreviewPage({params}: {params: Promise<{siteId:string}>}) {
  const {siteId} = await params;
  return <><PreviewClient />{siteId === 'medinsure' && <MedinsurePublicInfo />}</>;
}
