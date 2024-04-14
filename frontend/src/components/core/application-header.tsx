import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useChangeLocale, useCurrentLocale, useI18n } from "@/locales";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { TH, US } from "country-flag-icons/react/3x2";
import { BananaIcon, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { ThemeToggler } from "../ui/theme-toggler";

export default function ApplicationHeader() {
	const router = useRouter();
	const pathName = router.pathname;

	const t = useI18n();

	const changeLocale = useChangeLocale();
	const locale = useCurrentLocale();

	return (
		<header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 flex-row items-center gap-x-4">
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
								<span className="sr-only">{t("app.name")}</span>
							</Link>

							{navItems.map((item) => (
								<Link
									href={item.href}
									key={"nav_item_" + item.name}
									className={cn(
										"text-muted-foreground hover:text-foreground",
										item.href === router.pathname && "text-foreground"
									)}
								>
									<SheetClose className="w-full text-left">{t(item.i18nKey)}</SheetClose>
								</Link>
							))}
						</nav>
					</SheetContent>
				</Sheet>

				{/* Desktop Logo */}
				<Link href="/" className="hidden select-none items-center gap-2 text-lg font-semibold lg:flex">
					<div className="flex flex-row items-center gap-x-2 text-2xl font-bold">
						<BananaIcon className="h-6 w-6" />
						<span className="gradient-span">{t("app.name")}</span>
					</div>
					<span className="sr-only">{t("app.name")}</span>
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
							{/* This works, but no intellisense + the editor won't pick it up */}
							{t(item.i18nKey)}
						</Link>
					))}
				</div>

				{/* Right side */}
				<div className="ml-auto flex flex-row items-center gap-x-2">
					<ThemeToggler />

					<Select
						onValueChange={(value: any) => {
							changeLocale(value);
						}}
						defaultValue={locale}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="en">
								<div className="flex flex-row items-center gap-x-2">
									<US title="United States" className="h-5 w-5" />
									<span>English</span>
								</div>
							</SelectItem>
							<SelectItem value="th">
								<div className="flex flex-row items-center gap-x-2">
									<TH title="Thailand" className="h-5 w-5" />
									<span>ไทย (Thai)</span>
								</div>
							</SelectItem>
						</SelectContent>
					</Select>

					<SignedIn>
						<UserButton />
					</SignedIn>

					<SignedOut>
						<Link href="/sign-in">
							<Button size="sm">{t("header.signin")}</Button>
						</Link>
					</SignedOut>
				</div>
			</div>
		</header>
	);
}
