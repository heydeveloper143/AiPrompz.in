import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // enables static export
  images: {
    unoptimized: true, // required for remote images with static export
  },
};

export default nextConfig;
