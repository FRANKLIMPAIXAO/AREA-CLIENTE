import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    // Explicitly configure aliases for both Webpack and Turbopack
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "@": path.resolve(__dirname, "./"),
        };
        return config;
    },
    experimental: {
        turbo: {
            resolveAlias: {
                "@/": "./",
            },
        },
    },
};

export default nextConfig;
