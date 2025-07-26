/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/socket',
        destination: '/api/socket.io',
      },
    ];
  },
};

module.exports = nextConfig;
