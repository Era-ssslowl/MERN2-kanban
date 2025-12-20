/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GRAPHQL_HTTP: process.env.NEXT_PUBLIC_GRAPHQL_HTTP,
    NEXT_PUBLIC_GRAPHQL_WS: process.env.NEXT_PUBLIC_GRAPHQL_WS,
  },
};

export default nextConfig;
