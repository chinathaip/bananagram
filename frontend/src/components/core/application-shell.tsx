import { Inter } from "next/font/google";
import { TailwindIndicator } from "../ui/tailwind-indicator";
import ApplicationHeader from "./application-header";

const InterFont = Inter({ subsets: ["latin"] });

export default function ApplicationShell({ children }: { children: React.ReactNode }) {
	return (
		<div className={`relative flex h-screen min-h-screen w-full flex-col ${InterFont.className}`}>
			<ApplicationHeader />

			{/* The pt-16 here is the header height + 2, which in this case equals 16 */}
			{/* Doing it this way instead of making the header sticky because the `h-screen` in the parent container here */}
			{/* causes the header to disappear when scrolling past the viewport. */}
			{/* TODO: make this a css variable */}
			<main className="h-full pt-16">{children}</main>
			<TailwindIndicator />
		</div>
	);
}
