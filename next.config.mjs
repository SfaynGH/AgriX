/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgur.com',
      },
      {
        protocol: 'https',
        hostname: '*.loca.lt',
      },
    ],
  },
  experimental: {},
  serverExternalPackages: ['@tensorflow/tfjs-node'], // ✅ Updated here
};

export default nextConfig;
