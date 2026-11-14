import { ImageResponse } from 'next/og';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',padding:80,background:'#10233f',color:'white'}}><div style={{fontSize:28,color:'#6ed9ff'}}>THsoft</div><div style={{fontSize:100,fontWeight:700,marginTop:30}}>MedinSure</div><div style={{fontSize:40,marginTop:30}}>PROBE · Reports · Windows</div></div>,size);
}
