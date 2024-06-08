import { useCategory } from "@/lib/hooks/data-hooks/use-category";
import { Grip, Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "./card";
import { Input } from "./input";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { useState } from "react";

export default function CategoryMenu({ onSelectCategory }: { onSelectCategory: (value: string) => void }) {
	const { data: categoryData } = useCategory();
	const [category, setCategory] = useState("");
	return (
		<aside className="relative mr-2 hidden md:col-span-3 md:block">
			<Card>
				<CardHeader className="gap-y-2 px-0 pb-2 pt-0">
					<div className="relative w-full">
						<Input className="rounded-b-none py-6 pl-8" placeholder="Search for posts... " />
						<Search className="absolute left-0 top-1.5 m-2.5 h-4 w-4 text-muted-foreground" />
					</div>
				</CardHeader>

				<CardContent className="px-1 pb-2">
					<p className="my-2 px-3 text-xs font-medium text-muted-foreground ">
						Current Category: {category || "all"}
					</p>
					<ToggleGroup
						className="flex-col items-start"
						type="single"
						onValueChange={(category) => {
							setCategory(category);
							onSelectCategory(category);
						}}
					>
						{categoryData?.categories.map((category) => (
							<ToggleGroupItem className="w-full justify-start text-left" value={category.name}>
								<Grip className="mr-2 h-4 w-4" />
								{category.name}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</CardContent>
			</Card>
		</aside>
	);
}
