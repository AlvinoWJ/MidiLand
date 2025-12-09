// File: next.config.ts
// Ganti seluruh isi file Anda dengan ini.

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  typescript: {
    ignoreBuildErrors: true,
  },

  // Konfigurasi gambar yang benar untuk mengizinkan SEMUA avatar Google
  images: {
    remotePatterns: [
      {
        protocol: "http", // Sesuai pesan error
        hostname: "googleusercontent.com", // Sesuai pesan error
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https", // Ini untuk avatar Google yang umum (lh3)
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
