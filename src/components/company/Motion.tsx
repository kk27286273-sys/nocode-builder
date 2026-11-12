'use client';
import {useEffect,useRef,type ReactNode} from 'react';
import styles from './company.module.css';
export function Reveal({children,className='',delay=0}:{children:ReactNode;className?:string;delay?:number}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=ref.current;if(!el||matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){el.animate([{opacity:.2,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,delay,easing:'cubic-bezier(0.23,1,0.32,1)'});observer.disconnect();}},{threshold:.12});observer.observe(el);return()=>observer.disconnect();},[delay]);
 return <div ref={ref} className={className}>{children}</div>;
}
export function HeroScene({children}:{children:ReactNode}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=ref.current;if(!el)return;const media=matchMedia('(prefers-reduced-motion:no-preference) and (hover:hover) and (pointer:fine)');let frame=0;
 const move=(e:PointerEvent)=>{if(!media.matches)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const rect=el.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width-.5,y=(e.clientY-rect.top)/rect.height-.5;el.style.transform=`perspective(1400px) rotateX(${-y*3}deg) rotateY(${x*3}deg)`;});};
 const reset=()=>{cancelAnimationFrame(frame);el.style.transform='none';};el.addEventListener('pointermove',move);el.addEventListener('pointerleave',reset);media.addEventListener('change',reset);return()=>{reset();el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',reset);media.removeEventListener('change',reset);};},[]);
 return <div ref={ref} className={styles.scene}>{children}</div>;
}
