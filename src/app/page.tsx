import type { Metadata } from 'next';
import CompanyHome from '@/components/company/CompanyHome';
export const metadata: Metadata={title:{absolute:'THsoft | 기술로 더 나은 업무를 만듭니다'},description:'THsoft는 NEXIA 홈페이지 제작 솔루션과 MedinSure 보험 업무 지원 솔루션을 개발·운영하는 소프트웨어 회사입니다.',applicationName:'THsoft',alternates:{canonical:'/'},openGraph:{type:'website',locale:'ko_KR',url:'https://thsoft.co.kr/',siteName:'THsoft',title:'THsoft | Software for Better Work',description:'NEXIA와 MedinSure, 실제 업무를 위한 실용적인 소프트웨어.',images:[]},twitter:{card:'summary',title:'THsoft | Software for Better Work',description:'기술로 더 나은 업무를 만듭니다.',images:[]}};
export default function Page(){return <CompanyHome/>;}
