/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'robohash.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
