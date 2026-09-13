/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Next 16: any quality passed to next/image must be declared here or the
    // optimizer rejects the request. Code uses 50 (texture), 70 (logo/icons),
    // 75 (comic panels) and 80 (hero cutout).
    qualities: [50, 70, 75, 80],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  async headers() {
    return [
      {
        // Hashed static assets (fonts, optimized images) are safe to pin for
        // a year. The source pattern must match Next's font paths
        // (/_next/static/media/*.woff2), which the old ":all*" glob missed.
        source: "/:path*(png|jpg|jpeg|webp|avif|ico|svg|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
