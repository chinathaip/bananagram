import PostCard from "@/components/ui/post-card";
import { PostEditor } from "@/components/ui/post-editor";
import { useCategory } from "@/lib/hooks/data-hooks/use-category";
import { useInfinitePosts } from "@/lib/hooks/data-hooks/use-infinite-posts";
import { useLikePost } from "@/lib/hooks/data-hooks/use-like-post";
import { useIntersection } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { Post } from "@/gql/graphql";
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
import PostCardSkeleton from "@/components/ui/skeletons/post-card-skeleton";

export default function Home() {
	const [postCategory, setPostCategory] = useState<string>("");
	const { data, error, isError, isPending, isFetching, fetchNextPage, hasNextPage, refetch } = useInfinitePosts({
		categoryName: postCategory
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

	return (
		<div className="container mx-auto grid grid-cols-12">
			<aside className="relative mr-2 hidden md:col-span-3 md:block">
				<Command className="h-min rounded-lg border shadow-md">
					<CommandInput placeholder="Search category or hashtag..." />
					<CommandList className="max-h-min">
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Category">
							<CommandItem key="category_all" onSelect={() => setPostCategory("")}>
								<Grip className="mr-2 h-4 w-4" />
								<span>all</span>
							</CommandItem>
							{categoryData?.categories.map((category) => (
								<CommandItem
									key={`category_${category.name}`}
									value={category.name}
									onSelect={setPostCategory}
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
									post={edge?.node as Post}
									onBananaClick={() => {}}
									ref={isLastElement ? ref : null}
								/>
							);
						})
					)}
					{isPending && Array.from({ length: 5 }).map(() => <PostCardSkeleton />)}
					{!hasNextPage && <p className="my-2 text-center">You are all caught up</p>}
				</div>
			</div>
		</div>
	);
}
