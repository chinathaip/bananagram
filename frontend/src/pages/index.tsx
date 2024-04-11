import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export default function Home() {
	return (
		<div className="container mx-auto grid grid-cols-12">
			<div className="relative col-span-3">
				<div className="fixed">left</div>
			</div>
			{/* TODO: don't forget to remove h-screen, make this scrollable since it's the main content */}
			<div className="relative col-span-9 h-screen">
				<Card>
					<div className="flex flex-row items-start gap-x-4 p-4">
						{/* This mt-1 is here to push the avatar down a bit so it aligns with the title / username stuff */}
						{/* It's not an elegant solution by ay means, so...  */}
						{/* TODO: properly style and align this. */}
						<div className="mt-1">
							<Avatar>
								<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						</div>

						<div>
							<div className="flex flex-row items-center gap-x-2">
								<h3 className="text-2xl font-semibold leading-none tracking-tight">shadman</h3>
								<span className="text-sm text-muted-foreground">@shadcn</span>
							</div>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent
								libero. Sed cursus ante dapibus diam. Sed nisi.
							</p>
						</div>
					</div>
					{/* <CardHeader className="flex flex-row items-start justify-start gap-x-2">
						<Avatar>
							<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<CardTitle>Card Title</CardTitle>
					</CardHeader>

					<CardContent>
						<CardDescription>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
							Sed cursus ante dapibus diam. Sed nisi.
						</CardDescription>
					</CardContent>

					<CardFooter>
						<button className="btn">Click me</button>
					</CardFooter> */}
				</Card>
			</div>
		</div>
	);
}
