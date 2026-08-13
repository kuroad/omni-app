import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'http://backend:3001/api/:path*' 
          : 'http://localhost:4001/api/:path*'
      }
    ];
  },
};

export default nextConfig;
