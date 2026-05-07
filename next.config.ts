import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ye line Leaflet ko double-mount hone se rokegi
  reactStrictMode: false,

  // Aapka purana code
  allowedDevOrigins: ["10.222.49.208", "localhost"],
};

export default nextConfig;
