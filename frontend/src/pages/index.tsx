import PostCard from "@/components/ui/post-card";
import { PostEditor } from "@/components/ui/post-editor";
import { useInfinitePosts } from "@/lib/hooks/data-hooks/use-infinite-posts";
import { useLikePost } from "@/lib/hooks/data-hooks/use-like-post";
import { useIntersection } from "@mantine/hooks";
import { useEffect } from "react";

export default function Home() {
	const { data, error, isError, isPending, fetchNextPage, hasNextPage, refetch } = useInfinitePosts({});

	const { data: likeData, mutate } = useLikePost();
	const { ref, entry } = useIntersection({
		threshold: 0.1 // Adjust this threshold according to your preference for when the load should trigger
	});

	// Use effect to handle fetching next page
	useEffect(() => {
		if (entry?.isIntersecting && hasNextPage) {
			fetchNextPage();
		}
	}, [entry?.isIntersecting, hasNextPage, fetchNextPage]);

	if (isError) return <div>Error: {error.message}</div>;

	return (
		<div className="container mx-auto grid grid-cols-12">
			<div className="relative hidden md:col-span-3 md:block">Stuff goes here</div>
			<div className="relative col-span-12 flex flex-col gap-y-2 overflow-auto md:col-span-9">
				<div className="flex flex-col gap-y-2">
					<PostEditor requestRefetch={refetch} />
					{data?.pages.map((page, pageIndex) =>
						page.posts.edges.map((edge, index) => {
							const isLastElement =
								index === page.posts.edges.length - 1 && pageIndex === data.pages.length - 1;
							return (
								// <Card key={edge.node.id} className="p-2" ref={isLastElement ? ref : null}>
								// 	<p>{edge.node.user.username}</p>
								// 	<Separator />
								// 	{JSON.stringify(edge.node, null, 2)}
								// </Card>
								<PostCard
									key={edge.node.id}
									post={edge.node}
									// TODO: keep banana callback in postcard
									onBananaClick={(id) => {
										mutate(id);
									}}
									ref={isLastElement ? ref : null}
								/>
							);
						})
					)}

					<div className="mt-2 w-full text-center">
						{isPending && "Loading..."}
						{!hasNextPage && "You're all caught up!"}
					</div>
				</div>
				{/* <button onClick={fetchNextPage}>{hasNextPage ? "Load More" : "You're all caught up!"}</button> */}
			</div>
		</div>
	);
}
