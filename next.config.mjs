/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.IS_AGENT ? '.next-agent' : '.next',
};

export default nextConfig;
