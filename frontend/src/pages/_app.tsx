import "@/styles/globals.css";

import ApplicationShell from "@/components/core/application-shell";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { fontSans } from "@/lib/fonts";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			{/* This... is not an elegant solution, but I have no idea how to set the font on sheet/popover/etc. */}
			<style jsx global>{`
				html {
					font-family: ${fontSans.style.fontFamily};
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
				}
			`}</style>

			<Head>
				<title>Bananagram</title>
			</Head>

			<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
				<ApplicationShell>
					<Component {...pageProps} />
				</ApplicationShell>
			</ThemeProvider>
		</>
	);
}
