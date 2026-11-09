/** @type {import('next').NextConfig} */
const nextConfig = {
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
