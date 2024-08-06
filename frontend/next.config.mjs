/** @type {import('next').NextConfig} */
import dotenv from "dotenv";
dotenv.config();
const nextConfig = {
  images: {
    domains: [
      "*",
      "media.gettyimages.com",
      "https://cdn.iconscout.com/",
      "cdn.iconscout.com",
      "bytiyw1cp6.execute-api.ap-south-1.amazonaws.com",
      "bytiyw1cp6.execute-api.ap-south-1.amazonaws.com",
    ], // Add your image hosting domains here
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version,language,Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
