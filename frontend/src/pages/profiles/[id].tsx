import PostCard from "@/components/ui/post-card";
import ProfileCard from "@/components/ui/profile-card";
import PostCardSkeleton from "@/components/ui/skeletons/post-card-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post } from "@/gql/graphql";
import { useInfinitePosts } from "@/lib/hooks/data-hooks/use-infinite-posts";
import { useIntersection } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UserProfilePage() {
	const router = useRouter();
	const userId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
	const { data, error, isError, isPending, fetchNextPage, hasNextPage } = useInfinitePosts({
		userId
	});

	const { ref, entry } = useIntersection({
		threshold: 0.1
	});

	useEffect(() => {
		if (entry?.isIntersecting && hasNextPage) {
			fetchNextPage();
		}
	}, [entry?.isIntersecting, hasNextPage, fetchNextPage]);

	// TODO: proper loading skeletons, error, and empty states
	if (isError) return <div className="container">Error: {error.message}</div>;

	return (
		<div className="container grid grid-cols-12">
			<ProfileCard userId={userId || ""} />

			{/* Post section*/}
			<section className="col-span-12 lg:col-span-8 lg:pl-2 xl:col-span-9">
				<Tabs defaultValue="posts">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="posts">Posts</TabsTrigger>
						<TabsTrigger value="shares">Shares</TabsTrigger>
					</TabsList>

					{/* User's posts  */}
					<TabsContent value="posts">
						<div className="flex flex-col gap-y-2">
							{data?.pages.map((page, pageIndex) =>
								page.posts.edges.map((edge, index) => {
									return (
										<PostCard
											key={`postcard_${edge.node.id}`}
											post={edge.node as Post}
											onBananaClick={() => {}}
										/>
									);
								})
							)}
							{isPending && Array.from({ length: 5 }).map(() => <PostCardSkeleton />)}
						</div>
					</TabsContent>
					<TabsContent value="shares">
						<div>TODO</div>
					</TabsContent>

					<div className="mt-2 w-full text-center" ref={ref}>
						{isPending && "Loading..."}
						{!hasNextPage && "You've reached the end!"}
					</div>
				</Tabs>
			</section>
		</div>
	);
}
