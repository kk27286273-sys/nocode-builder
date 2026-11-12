'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,ChevronDown,Menu,X} from 'lucide-react';
import styles from './company.module.css';
export default function CompanyHeader(){
 const [open,setOpen]=useState(false);const trigger=useRef<HTMLButtonElement>(null);const products=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{const close=(event:KeyboardEvent)=>{if(event.key==='Escape'){if(products.current?.open)products.current.open=false;if(open){setOpen(false);trigger.current?.focus();}}};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close);},[open]);
 return <header className={styles.header} onKeyDown={e=>{if(e.key==='Escape'){if(open){setOpen(false);trigger.current?.focus();}if(products.current?.open){products.current.open=false;products.current.querySelector('summary')?.focus();}}}}>
  <Link href="/" aria-label="THsoft 홈" className={styles.brand}><span aria-hidden="true" className={styles.brandIcon}>T</span>THsoft<span className={styles.brandDot}>.</span></Link>
  <button ref={trigger} className={styles.mobileToggle} type="button" aria-label={open?'메뉴 닫기':'메뉴 열기'} aria-expanded={open} aria-controls="company-navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
  <nav id="company-navigation" aria-label="주 메뉴" className={`${styles.navigation} ${open?styles.navOpen:''}`}>
   <details ref={products} className={styles.productsMenu} onMouseEnter={()=>{if(matchMedia('(hover:hover)').matches&&products.current)products.current.open=true;}} onMouseLeave={()=>{if(products.current&&!products.current.contains(document.activeElement))products.current.open=false;}}>
    <summary>Products <ChevronDown size={14}/></summary><div><Link href="/nexia" onClick={()=>setOpen(false)}><strong>NEXIA</strong><span>홈페이지 제작 솔루션</span></Link><a href="https://medinsure.co.kr/" onClick={()=>setOpen(false)}><strong>MedinSure</strong><span>보험 업무 지원 솔루션</span></a></div>
   </details>
   {[['/#solutions','Solutions'],['/#pricing','Pricing'],['/#company','Company'],['/#contact','Contact']].map(([href,label])=><Link key={label} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}
   <Link href="/login" className={styles.login}>로그인</Link><a href="http://pf.kakao.com/_qxmixiX/chat" target="_blank" rel="noreferrer" className={styles.headerCta}>문의하기 <ArrowUpRight size={15}/></a>
  </nav>
 </header>;
}
