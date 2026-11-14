/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return ['/api/:path*','/update.json','/admin/:path*','/builder/:path*','/builder-login','/login','/organization/:path*','/dashboard/:path*','/pay/:path*','/checkout/:path*','/medinsure/login','/medinsure/checkout-result'].map(source=>({source,has:[{type:'host' as const,value:'(www[.])?medinsure[.]co[.]kr'}],headers:[{key:'X-Robots-Tag',value:'noindex, nofollow, nosnippet'}]}));
  },
  async redirects() {
    return ['medinsure.co.kr', 'www.medinsure.co.kr'].map((host) => ({
      source: '/login',
      has: [{ type: 'host' as const, value: host.replaceAll('.', '[.]') }],
      destination: '/medinsure/login',
      permanent: false,
    }));
  },
  env: {
    NEXT_PUBLIC_PRICING_REVIEW: String(process.env.VERCEL_ENV === 'preview' ||
      (!process.env.VERCEL_ENV && process.env.TH_SOFT_PRICING_REVIEW === 'true')),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
