/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "",
				pathname: "/**/*"
			},
			{
				protocol: "https",
				hostname: "files-beta.stamford.dev",
				port: "",
				pathname: "/bananagram/**"
			},
			{
				protocol: "https",
				hostname: "pbs.twimg.com",
				port: "",
				pathname: "/profile_banners/**"
			}
		]
	}
};

export default nextConfig;
