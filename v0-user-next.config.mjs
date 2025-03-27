/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'files.catbox.moe',
      'i.ytimg.com',
      'i5.walmartimages.com',
      'ae-pic-a1.aliexpress-media.com',
      'www.1999.co.jp',
      'cdn.suruga-ya.com',
      's4.anilist.co',
      'm.media-amazon.com',
      'cdn.discordapp.com',
      'media.discordapp.net'
    ],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;

