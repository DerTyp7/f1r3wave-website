import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	experimental: {
		serverActions: {
			bodySizeLimit: "10gb",
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "upload.wikimedia.org",
				port: "",
				pathname: "/wikipedia/commons/**",
			},
			{
				protocol: "https",
				hostname: "static.vecteezy.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
