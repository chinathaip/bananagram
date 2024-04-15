import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
	return (
		<div className="grid min-h-full place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
			<div className="text-center">
				<p className="text-base font-semibold dark:text-yellow-400">404</p>
				<h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
				<p className="mt-6 text-base leading-7 text-muted-foreground">
					Sorry, we couldn&apos;t find the page you&apos;re looking for.
				</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<Link href="/">
						<Button>Go back home</Button>
					</Link>
					{/* TODO: make this a mailto: */}
					<Link href="/contact" className="flex flex-row items-center text-sm font-semibold">
						Contact support <ArrowRightIcon />
					</Link>
				</div>
			</div>
		</div>
	);
}
