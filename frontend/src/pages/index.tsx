import PostCard from "@/components/ui/post-card";
import { PostEditor } from "@/components/ui/post-editor";
import { useCategory } from "@/lib/hooks/data-hooks/use-category";
import { useInfinitePosts } from "@/lib/hooks/data-hooks/use-infinite-posts";
import { useLikePost } from "@/lib/hooks/data-hooks/use-like-post";
import { useIntersection } from "@mantine/hooks";
import { useState, useEffect } from "react";
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

export default function Home() {
	const [categoryId, setCategoryId] = useState<number>(0);
	const { data, error, isError, isPending, isFetching, fetchNextPage, hasNextPage, refetch } = useInfinitePosts({
		categoryId
	});
	const { data: categoryData } = useCategory();
	const { data: likeData, mutate } = useLikePost();
	const { ref, entry } = useIntersection({
		threshold: 0.1
	});
	// Use effect to handle fetching next page
	useEffect(() => {
		if (entry?.isIntersecting && !isFetching && hasNextPage) {
			fetchNextPage();
		}
	}, [entry?.isIntersecting, hasNextPage, isFetching, fetchNextPage]);

	if (isError) return <div className="container">Error: {error.message}</div>;
	if (isPending) return <div className="container">Loading...</div>;

	return (
		<div className="container mx-auto grid grid-cols-12">
			<aside className="relative mr-2 hidden md:col-span-3 md:block">
				<Command className="h-min w-auto rounded-lg border shadow-md">
					<CommandInput placeholder="Search category or hashtag..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Category">
							<CommandItem key="category_all" onSelect={() => setCategoryId(1)}>
								<Grip className="mr-2 h-4 w-4" />
								<span>All</span>
							</CommandItem>
							{categoryData?.categories.map((category) => (
								<CommandItem
									key={`category_${category.name}`}
									value={category.id.toString()}
									onSelect={(value) => setCategoryId(parseInt(value))}
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

				<Separator />
			</aside>
			<div className="relative col-span-12 flex flex-col gap-y-2 overflow-auto md:col-span-9">
				<div className="flex flex-col gap-y-2">
					<PostEditor postCategories={categoryData?.categories} requestRefetch={refetch} />
					{data?.pages.map((page, pageIndex) =>
						page.posts.edges.map((edge, index) => {
							const isLastElement =
								index === page.posts.edges.length - 1 && pageIndex === data.pages.length - 1;
							return (
								<PostCard
									key={`postcard_${edge.node.id}`}
									post={edge?.node}
									onBananaClick={() => {}}
									ref={isLastElement ? ref : null}
								/>
							);
						})
					)}
				</div>

				<div className="mt-2 w-full text-center">
					{isPending && "Loading..."}
					{!hasNextPage && "You've reached the end!"}
				</div>
			</div>
		</div>
	);
}
