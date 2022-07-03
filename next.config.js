/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["twemoji.maxcdn.com"],
  },
}

module.exports = nextConfig
