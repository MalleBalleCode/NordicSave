/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // AUTH_SECRET kan också heta NEXTAUTH_SECRET – vi stödjer båda
  // (Auth.js v5 föredrar AUTH_SECRET, men NEXTAUTH_SECRET fungerar)
};

module.exports = nextConfig;
