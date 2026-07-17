/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  images: {
    domains: [],
  },
  // Support for public directory assets
  async rewrites() {
    return [];
  },
  // Disable TypeScript build errors (optional - remove to enable strict checks)
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
