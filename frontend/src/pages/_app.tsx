import ApplicationShell from "@/components/core/application-shell";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
			<ApplicationShell>
				<Component {...pageProps} />
			</ApplicationShell>
		</ThemeProvider>
	);
}
