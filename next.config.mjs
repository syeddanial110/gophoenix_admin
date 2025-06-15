/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "sports-new-production.up.railway.app",
      "res.cloudinary.com",
      "wcx78p18-5000.inc1.devtunnels.ms",
      // add other allowed domains here
    ],
  },
};

export default nextConfig;
