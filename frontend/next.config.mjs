/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "localhost",
				port: "",
				pathname: "/**/*"
			},
			{
				protocol: "https",
				hostname: "pbs.twimg.com",
				port: "",
				pathname: "/profile_banners/**"
			}
		]
	},
	i18n: {
		locales: ["en", "th"],
		defaultLocale: "en"
	}
};

export default nextConfig;
