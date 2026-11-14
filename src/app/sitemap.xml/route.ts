const thsoftOriginal = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n  <url>\n    <loc>https://thsoft.co.kr</loc>\n    <lastmod>2026-11-11</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n  <url>\n    <loc>https://thsoft.co.kr/builder</loc>\n    <lastmod>2026-10-18</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n  <url>\n    <loc>https://thsoft.co.kr/nexia</loc>\n    <lastmod>2026-11-11</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n</urlset>\n";
export function GET(request: Request) {
  const med = ['medinsure.co.kr','www.medinsure.co.kr'].includes((request.headers.get('host')?.split(':')[0] || new URL(request.url).hostname).toLowerCase());
  if (!med) return new Response(thsoftOriginal, {headers: {'Content-Type': 'application/xml; charset=utf-8'}});
  const origin = 'https://medinsure.co.kr';
  const paths = med ? ['/', '/medinsure/download'] : ['/', '/nexia', '/terms', '/privacy', '/refund'];
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(path=>'<url><loc>'+origin+path+'</loc></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
