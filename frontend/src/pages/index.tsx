import PostCard from "@/components/ui/post-card";
import { PostEditor } from "@/components/ui/post-editor";
import { useCategory } from "@/lib/hooks/data-hooks/use-category";
import { useInfinitePosts } from "@/lib/hooks/data-hooks/use-infinite-posts";
import { useIntersection } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { Post } from "@/gql/graphql";
import PostCardSkeleton from "@/components/ui/skeletons/post-card-skeleton";
import CategoryMenu from "@/components/ui/category-menu";

export default function Home() {
	const [postCategory, setPostCategory] = useState<string>("");
	const { data, error, isError, isPending, isFetching, fetchNextPage, hasNextPage, refetch } = useInfinitePosts({
		categoryName: postCategory
	});
	const { data: categoryData } = useCategory();

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
			<CategoryMenu onSelectCategory={setPostCategory} />
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
									ref={isLastElement ? ref : null}
								/>
							);
						})
					)}
					{isPending &&
						Array.from({ length: 5 }).map((_, index) => (
							<PostCardSkeleton key={`postCardSkeletion_${index}`} />
						))}
					{!hasNextPage && <p className="my-2 text-center">You are all caught up</p>}
				</div>
			</div>
		</div>
	);
}
