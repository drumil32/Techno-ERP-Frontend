import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['erp-development.s3.amazonaws.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' }
        ]
      }
    ];
  }
};

export default nextConfig;
