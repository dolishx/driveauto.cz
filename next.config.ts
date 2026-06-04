import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ptpouetttwyqksnksboc.supabase.co",
        pathname: "/storage/v1/object/public/vehicle-images/**",
      },
    ],
  },
};

export default nextConfig;
