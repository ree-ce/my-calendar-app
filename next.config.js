/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true,
    },
    basePath: process.env.NODE_ENV === 'production' ? '/my-calendar-app' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/my-calendar-app/' : '',
  }

  module.exports = nextConfig