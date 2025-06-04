/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "sports-new-production.up.railway.app",
      "res.cloudinary.com",
      // add other allowed domains here
    ],
  },
};

export default nextConfig;
