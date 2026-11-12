import type { Metadata } from 'next';
import NexiaLanding from '@/components/home/NexiaLanding';
export const metadata: Metadata = {title:{absolute:'NEXIA | THsoft 홈페이지 제작·관리 솔루션'},description:'NEXIA 홈페이지 제작·관리 서비스. 업종별 템플릿, 반응형 홈페이지와 유지보수를 확인하세요.',alternates:{canonical:'/nexia'},openGraph:{title:'NEXIA | THsoft',description:'홈페이지 제작·관리 솔루션',url:'https://thsoft.co.kr/nexia',siteName:'THsoft'},twitter:{card:'summary',title:'NEXIA | THsoft',description:'홈페이지 제작·관리 솔루션'}};
export default function Page(){return <NexiaLanding/>;}
