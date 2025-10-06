import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	experimental: {
		serverActions: {
			bodySizeLimit: "10gb",
		},
	},
};

export default nextConfig;
