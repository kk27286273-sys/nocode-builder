const thsoftOriginal = "User-agent: *\nAllow: /\nSitemap: https://thsoft.co.kr/sitemap.xml";
export function GET(request: Request) {
  const host = (request.headers.get('host')?.split(':')[0] || new URL(request.url).hostname).toLowerCase();
  const med = ['medinsure.co.kr','www.medinsure.co.kr'].includes(host);
  if (!med) return new Response(thsoftOriginal, {headers: {'Content-Type': 'text/plain; charset=utf-8'}});
  const origin = 'https://medinsure.co.kr';
  return new Response('User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nDisallow: /builder\nDisallow: /organization\nDisallow: /dashboard\nSitemap: '+origin+'/sitemap.xml\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
