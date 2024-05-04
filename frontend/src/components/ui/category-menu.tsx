import { useCategory } from "@/lib/hooks/data-hooks/use-category";
import { Separator } from "@/components/ui/separator";
import { Flame, Grip, Hash } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator
} from "@/components/ui/command";

export default function CategoryMenu({ onSelectCategory }: { onSelectCategory: (value: string) => void }) {
	const { data: categoryData } = useCategory();
	return (
		<aside className="relative mr-2 hidden md:col-span-3 md:block">
			<Command className="h-min rounded-lg border shadow-md">
				<CommandInput placeholder="Search category or hashtag..." />
				<CommandList className="max-h-min">
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Category">
						<CommandItem key="category_all" onSelect={() => onSelectCategory("")}>
							<Grip className="mr-2 h-4 w-4" />
							<span>all</span>
						</CommandItem>
						{categoryData?.categories.map((category) => (
							<CommandItem
								key={`category_${category.name}`}
								value={category.name}
								onSelect={onSelectCategory}
							>
								<Grip className="mr-2 h-4 w-4" />
								<span>{category.name}</span>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Trending Hashtags">
						<CommandItem>
							<Hash className="mr-2 h-4 w-4" />
							<span>STIU</span>
							<Flame className="ml-auto h-4 w-4" />
							<span>1</span>
						</CommandItem>
						<CommandItem>
							<Hash className="mr-2 h-4 w-4" />
							<span>CourseCompose</span>
							<Flame className="ml-auto h-4 w-4" />
							<span>2</span>
						</CommandItem>
						<CommandItem>
							<Hash className="mr-2 h-4 w-4" />
							<span>Syntax Club</span>
							<Flame className="ml-auto h-4 w-4" />
							<span>3</span>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</aside>
	);
}
