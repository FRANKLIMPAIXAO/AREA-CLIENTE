import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    const aliasPath = path.resolve(process.cwd());
    console.log(">>>>>>>> Setting webpack alias '@' to:", aliasPath);
    config.resolve.alias['@'] = aliasPath;
    return config;
  },
};

export default nextConfig;
