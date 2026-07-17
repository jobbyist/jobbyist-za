/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output configuration for Vercel deployment
  output: 'standalone',
  
  // Disable image optimization for static export if needed
  images: {
    unoptimized: true,
  },
  
  typescript: {
    // Dangerously allow production builds to successfully complete 
    // even if your project contains strict TypeScript complaints.
    ignoreBuildErrors: true,
  },
  
  eslint: {
    // Bypasses ESLint syntax analysis warning blocks 
    // from halting the Vercel deployment compilation.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
