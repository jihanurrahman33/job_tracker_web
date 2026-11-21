/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_DEFAULT_API_URL:
      process.env.NEXT_PUBLIC_DEFAULT_API_URL ||
      "https://job-tracker-server-nu.vercel.app",
  },
};

export default nextConfig;
