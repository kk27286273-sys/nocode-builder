import { medinsureMetadata } from '@/lib/medinsure/seo';
export const metadata = medinsureMetadata('메딘슈어 | MedinSure — 서비스 안내', 'MedinSure 계정·서비스 안내입니다.', '/medinsure', false);
export default function Layout({children}: {children: React.ReactNode}) { return children; }
