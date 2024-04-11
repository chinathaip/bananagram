import { Inter } from "next/font/google";
import { TailwindIndicator } from "../ui/tailwind-indicator";
import ApplicationHeader from "./application-header";

const InterFont = Inter({ subsets: ["latin"] });

export default function ApplicationShell({ children }: { children: React.ReactNode }) {
	return (
		<div className={`relative flex h-screen min-h-screen w-full flex-col ${InterFont.className}`}>
			<ApplicationHeader />
			<main className="h-full pt-2">{children}</main>
			<TailwindIndicator />
		</div>
	);
}
