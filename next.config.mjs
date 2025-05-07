/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: false,
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.stripe.com',
      },
    ],
  },
  swcMinify: true,
  experimental: {
    forceSwcTransforms: true,
  },
}

export default nextConfig
