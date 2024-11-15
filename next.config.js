/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true,
    },
    basePath: process.env.NODE_ENV === 'production' ? '/my-calendar-app' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/my-calendar-app/' : '',
    webpack: (config) => {
      config.resolve.fallback = { fs: false, path: false };
      return config;
    },
  }

  module.exports = nextConfig