/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  swcMinify: true, // Enable SWC minification
  experimental: {
    forceSwcTransforms: true, // Force SWC to handle modern JS
  },
  transpilePackages: ["firebase", "@firebase", "protobufjs"], // Transpile Firebase and protobufjs
};

export default nextConfig;