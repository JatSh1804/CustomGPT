const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  // assetPrefix: isProd ? "/aptos-wallet-adapter" : "",
  // basePath: isProd ? "/aptos-wallet-adapter" : "",
  missingSuspenseWithCSRBailout: false,
  reactStrictMode: true,
  transpilePackages: ["wallet-adapter-react", "wallet-adapter-plugin"],
  
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  webpack: (config) => {
    config.resolve.fallback = { "@solana/web3.js": false };
    return config;
  },
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'lh3.googleusercontent.com'
    },]
  }
};

export default nextConfig;
