/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "api.activityphysical.tech",
      "wcx78p18-5000.inc1.devtunnels.ms",
      "api.activityphysical.tech/uploads"
      // add other allowed domains here
    ],
  },
};

export default nextConfig;
