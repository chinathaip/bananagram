import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { BananaIcon, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { ThemeToggler } from "../ui/theme-toggler";

export default function ApplicationHeader() {
	const router = useRouter();
	const pathName = router.pathname;

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 flex-row items-center gap-x-4 lg:h-20">
				{/* Mobile Nav / Burger */}
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon" className="shrink-0 md:hidden">
							<Menu className="h-6 w-6" />
							<span className="sr-only">Toggle navigation menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left">
						<nav className="grid gap-6 text-lg font-medium">
							<Link href="/" className="flex select-none items-center gap-2 text-lg font-semibold">
								<BananaIcon className="h-6 w-6" />
								<span className="sr-only">Bananagram</span>
							</Link>

							{navItems.map((item) => (
								<Link
									href={item.href}
									key={item.name}
									className={cn(
										"text-muted-foreground hover:text-foreground",
										item.href === router.pathname && "text-foreground"
									)}
								>
									<SheetClose>{item.name}</SheetClose>
								</Link>
							))}
						</nav>
					</SheetContent>
				</Sheet>

				{/* Desktop Logo */}
				<Link href="/" className="hidden select-none items-center gap-2 text-lg font-semibold lg:flex">
					<div className="flex flex-row items-center gap-x-2 text-2xl font-bold">
						<BananaIcon className="h-6 w-6" />
						Bananagram
					</div>
					<span className="sr-only">Bananagram</span>
				</Link>

				{/* Desktop Nav */}
				<div className="hidden flex-row gap-x-4 md:flex">
					{navItems.map((item) => (
						<Link
							href={item.href}
							key={item.name}
							className={cn(
								"text-sm font-medium transition-colors hover:text-primary",
								pathName !== item.href && "text-muted-foreground"
							)}
						>
							{item.name}
						</Link>
					))}
				</div>

				{/* Right side */}
				<div className="ml-auto flex flex-row items-center gap-x-2">
					<ThemeToggler />
				</div>
			</div>
		</header>
	);
}
