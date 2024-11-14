/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // 啟用靜態輸出
    images: {
      unoptimized: true,  // 對於靜態輸出必須設定
    },
    basePath: process.env.NODE_ENV === 'production' ? '/my-calendar-app' : '',  // 替換成你的 repository 名稱
    assetPrefix: process.env.NODE_ENV === 'production' ? '/my-calendar-app/' : '',  // 替換成你的 repository 名稱
  }

  module.exports = nextConfig