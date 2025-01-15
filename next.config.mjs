/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AWS_REGION: process.env.AWS_REGION,
    URL: process.env.URL,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AUTH_TOKEN: process.env.AUTH_TOKEN,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

export default nextConfig;
