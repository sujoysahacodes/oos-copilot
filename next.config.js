/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
