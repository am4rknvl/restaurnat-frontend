/**
 * Minimal Next.js config to reduce build memory usage during static image processing.
 * Disables built-in image optimization which can be memory-heavy during `next build`.
  * Remove or adjust this for production CDN image optimization later.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Disable next/image optimization at build time to reduce memory usage for local builds
    unoptimized: true,
  },
  experimental: {
    optimizeCss: false,
  },
  // Use less aggressive minification to reduce memory pressure on small/dev machines
  swcMinify: false,
  productionBrowserSourceMaps: false,
}

export default nextConfig
