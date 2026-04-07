/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: "/USImages/:path*", destination: "/home-images/:path*" },
      { source: "/UKImages/:path*", destination: "/home-images/:path*" },
      { source: "/DEImages/:path*", destination: "/home-images/:path*" },
      { source: "/BRImages/:path*", destination: "/home-images/:path*" },
      { source: "/CNImages/:path*", destination: "/home-images/:path*" },
      { source: "/FRImages/:path*", destination: "/home-images/:path*" },
      { source: "/ITImages/:path*", destination: "/home-images/:path*" },
      { source: "/JPImages/:path*", destination: "/home-images/:path*" },
      { source: "/MXImages/:path*", destination: "/home-images/:path*" },
      { source: "/RUImages/:path*", destination: "/home-images/:path*" },
      { source: "/SAImages/:path*", destination: "/home-images/:path*" },
      { source: "/VNImages/:path*", destination: "/home-images/:path*" },
    ];
  },
  async redirects() {
    return [];
  },
};

export default nextConfig;
