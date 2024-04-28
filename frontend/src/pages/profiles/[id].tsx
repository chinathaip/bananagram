import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/ui/post-card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFollow } from "@/lib/hooks/data-hooks/use-follow";
import { useInfinitePosts } from "@/lib/hooks/data-hooks/use-infinite-posts";
import { useUnfollow } from "@/lib/hooks/data-hooks/use-unfollow";
import { useUser } from "@/lib/hooks/data-hooks/use-user";
import { useIntersection } from "@mantine/hooks";
import { format } from "date-fns";
import { CalendarIcon, Send, UserRoundCog, UserRoundMinusIcon, UserRoundPlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UserProfilePage() {
	const router = useRouter();
	const userId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
	const { data, error, isError, isPending, fetchNextPage, hasNextPage } = useInfinitePosts({
		userId
	});
	const { mutateAsync: follow } = useFollow();
	const { mutateAsync: unfollow } = useUnfollow();

	const { data: userData, refetch } = useUser(userId);

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
	if (isPending) return <div className="container">Loading...</div>;
	if (!userData?.user) return <div className="container">Error: user not found</div>;

	return (
		<div className="container grid grid-cols-12">
			{/* Left profile aside */}
			{/* NOTE: I have no idea why top-16 is required here, but it offsets perfectly with the padding.*/}
			{/* top-14 also offsets it perfectly, minus the padding so its top is directly flat against the header */}
			{/* Probably due to the header's height + its padding */}
			<aside className="col-span-12 mb-2 h-min overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm lg:sticky lg:top-16 lg:col-span-4 xl:col-span-3">
				<section className="mb-2" aria-labelledby="profile-header">
					<div className="flex flex-col">
						<div className="relative h-24 bg-secondary">
							<Image
								className="select-none"
								src="https://pbs.twimg.com/profile_banners/1504109916461539336/1685621542/1500x500"
								fill
								objectFit="cover"
								alt="banananaynay's profile cover picture"
							/>
						</div>
						{/* <div className="relative flex flex-col"> */}
						<div className="h-12">
							<Avatar className="ml-2 h-24 w-24 -translate-y-1/2 border-2 border-background">
								<AvatarImage
									className="select-none"
									src={userData.user.profile_picture}
									alt="{@bananayhtet's} profile picture"
								/>
								<AvatarFallback>NT</AvatarFallback>
							</Avatar>
						</div>
						<div className="mt-2 flex flex-row items-center px-2">
							<div>
								<div className="text-lg font-semibold">{userData.user.display_name}</div>
								<div className="text-muted-foreground">@{userData.user.username}</div>
							</div>
							<div className="ml-auto">
								{userData.user.is_owner ? (
									<Button>
										<UserRoundCog className="h-6 w-6" />
										Edit
									</Button>
								) : (
									<div className="flex flex-row gap-x-2 ">
										{userData.user.is_following ? (
											<Button
												onClick={() => {
													unfollow(userData.user.id)
														.then(() => refetch())
														.catch(console.error);
												}}
											>
												<UserRoundMinusIcon className="mr-2 h-6 w-6" />
												Unfollow
											</Button>
										) : (
											<Button
												onClick={() => {
													follow(userData.user.id)
														.then(() => refetch())
														.catch(console.error);
												}}
											>
												<UserRoundPlusIcon className="mr-2 h-6 w-6" />
												Follow
											</Button>
										)}
										<Button>
											<Send className="h-6 w-6" />
										</Button>
									</div>
								)}
							</div>
						</div>
						{/* </div> */}
					</div>
				</section>

				<Separator />

				<section className="mt-2 p-2 pt-0" aria-labelledby="profile-details">
					<div className="mt-1">{userData.user.bio} </div>

					<div className="mt-4 flex flex-row items-center text-sm text-muted-foreground">
						<CalendarIcon className="mr-2 h-6 w-6" />
						<time dateTime={format(userData.user.created_at, "dd-mm-yyyy")} className="select-text">
							Joined: {new Date(userData.user.created_at).toLocaleDateString()}
						</time>
					</div>

					<div className="mt-1 flex">
						<div className="mr-4">
							<span className="font-semibold">{userData.user.following}</span>{" "}
							<span className="text-muted-foreground">Following</span>
						</div>
						<div>
							<span className="font-semibold">{userData.user.followers}</span>{" "}
							<span className="text-muted-foreground">Followers</span>
						</div>
					</div>
				</section>
			</aside>

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
											post={edge.node}
											onBananaClick={() => {}}
										/>
									);
								})
							)}
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
