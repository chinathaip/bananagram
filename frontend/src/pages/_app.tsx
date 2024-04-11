import "@/styles/globals.css";

import ApplicationShell from "@/components/core/application-shell";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { fontSans } from "@/lib/fonts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import Head from "next/head";

const queryClient = new QueryClient();

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
				<QueryClientProvider client={queryClient}>
					<ApplicationShell>
						<Component {...pageProps} />
					</ApplicationShell>
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</ThemeProvider>
		</>
	);
}
