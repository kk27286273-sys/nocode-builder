/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_PRICING_REVIEW: String(process.env.VERCEL_ENV === 'preview' ||
      (!process.env.VERCEL_ENV && process.env.TH_SOFT_PRICING_REVIEW === 'true')),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
