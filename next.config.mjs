/** @type {import('next').NextConfig} */
const nextConfig = {
    // disabled for production builds 
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
