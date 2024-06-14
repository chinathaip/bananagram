import { Card } from "@/components/ui/card";
import CreatePostDialog from "@/components/ui/create-post-dialog";
import PostCard from "@/components/ui/post-card";
import ProfileCard from "@/components/ui/profile-card";
import PostCardSkeleton from "@/components/ui/skeletons/post-card-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post } from "@/gql/graphql";
import { useInfinitePosts } from "@/lib/hooks/data-hooks/use-infinite-posts";
import { usePostShare } from "@/lib/hooks/data-hooks/use-post-share";
import { useSession } from "@clerk/nextjs";
import { useIntersection } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format, formatDistance } from "date-fns";
import { useUser } from "@/lib/hooks/data-hooks/use-user";

export default function UserProfilePage() {
	const router = useRouter();
	const userId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
	const { data, error, isError, isPending, fetchNextPage, hasNextPage, refetch } = useInfinitePosts({
		userId
	});
	const { data: postShareData } = usePostShare(userId || "");

	const { ref, entry } = useIntersection({
		threshold: 0.1
	});

	const { data: userData } = useUser(userId);

	useEffect(() => {
		if (entry?.isIntersecting && hasNextPage) {
			fetchNextPage();
		}
	}, [entry?.isIntersecting, hasNextPage, fetchNextPage]);

	// TODO: proper loading skeletons, error, and empty states
	if (isError) return <div className="container">Error: {error.message}</div>;

	const { session } = useSession();

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
							{session?.user.id === userId && <CreatePostDialog onPostCreated={refetch} />}
							{data?.pages.map((page, pageIndex) =>
								page.posts.edges.map((edge, index) => {
									return (
										<PostCard
											key={`postcard_${edge.node.id}`}
											post={edge.node as Post}
											onEdit={() => refetch()}
											onDelete={() => refetch()}
										/>
									);
								})
							)}
							{isPending && Array.from({ length: 5 }).map(() => <PostCardSkeleton />)}
						</div>
					</TabsContent>
					<TabsContent value="shares">
						<div>
							<div className="relative col-span-12 flex flex-col gap-y-2 overflow-auto lg:col-span-8 xl:col-span-9">
								{postShareData?.postShares.map((postShare) => (
									<div className="relative col-span-12 flex flex-col gap-y-2 overflow-auto lg:col-span-8 xl:col-span-9">
										<Card className="p-4">
											<div className=" flex flex-row items-center gap-x-3">
												<Avatar>
													<AvatarImage
														src={userData?.user?.profile_picture}
														alt={`@${userData?.user?.profile_picture}`}
													/>
													<AvatarFallback>
														{postShare.post.user.username.substring(0, 2)}
													</AvatarFallback>
												</Avatar>

												<span className="break-all hover:underline">
													{userData?.user?.username}
												</span>

												<Tooltip>
													<TooltipContent>
														Created: {format(postShare.shared_at, "do MMM yyyy ppp")}
													</TooltipContent>
													<TooltipTrigger className="text-sm text-muted-foreground">
														<time
															dateTime={format(postShare.shared_at, "do MMM yyyy ppp")}
															className="select-text"
														>
															{formatDistance(postShare.shared_at, new Date(), {
																addSuffix: true
															})}
														</time>
													</TooltipTrigger>
												</Tooltip>
											</div>

											<div className="flex flex-col gap-y-3 pl-14">
												{postShare.share_content}
												<PostCard
													post={postShare.post as Post}
													onEdit={() => {}}
													onDelete={() => {}}
												/>
											</div>
										</Card>
									</div>
								))}
							</div>
						</div>
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
