import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/ui/post-card";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, UserRoundPlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { useInfinitePosts } from "@/lib/hooks/data-hooks/use-infinite-posts";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks/data-hooks/use-user";
import { User } from "@/gql/graphql";
import { useSession } from "@clerk/nextjs";

interface UserProfileCardProps {
	user: User;
}

function UserProfileCard({ user }: UserProfileCardProps) {
	/* Left profile aside 
	/* NOTE: I have no idea why top-16 is required here, but it offsets perfectly with the padding.*/
	/* top-14 also offsets it perfectly, minus the padding so its top is directly flat against the header */
	/* Probably due to the header's height + its padding */
	return (
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
								src={user.profile_picture}
								alt="{@bananayhtet's} profile picture"
							/>
							<AvatarFallback>NT</AvatarFallback>
						</Avatar>
					</div>
					<div className="mt-2 flex flex-row items-center px-2">
						<div>
							<div className="text-lg font-semibold">{user.display_name}</div>
							<div className="text-muted-foreground">@{user.username}</div>
							<div>{user.is_owner ? "owner" : "nope"}</div>
						</div>
						<div className="ml-auto">
							<Button>
								<UserRoundPlusIcon className="h-6 w-6" />
							</Button>

							{/* <button className="btn btn-secondary">Message</button> */}
							{/* <button className="btn btn-secondary">Edit Profile</button> */}
							{/* <button className="btn btn-secondary">More</button> */}
						</div>
					</div>
					{/* </div> */}
				</div>
			</section>

			<Separator />

			<section className="mt-2 p-2 pt-0" aria-labelledby="profile-details">
				<div className="mt-1">{user.bio} </div>

				<div className="mt-4 flex flex-row items-center text-sm text-muted-foreground">
					<CalendarIcon className="h-6 w-6" />
					<time dateTime="2021-02">
						<span className="select-none">&nbsp;</span>Joined February 2021
					</time>
				</div>

				<div className="mt-1 flex">
					<div className="mr-4">
						<span className="font-semibold">18</span>{" "}
						<span className="text-muted-foreground">Following</span>
					</div>
					<div>
						<span className="font-semibold">20</span>{" "}
						<span className="text-muted-foreground">Followers</span>
					</div>
				</div>
			</section>
		</aside>
	);
}

export default function UserProfilePage() {
	const router = useRouter();
	const userId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
	const { data, error, isError, isPending, fetchNextPage, hasNextPage } = useInfinitePosts({
		userId
	});

	const { session, isLoaded, isSignedIn } = useSession();
	const [token, setToken] = useState("");

	const { data: userData, refetch } = useUser(userId || "", token);

	useEffect(() => {
		if (isLoaded && isSignedIn && session) {
			session
				.getToken({ template: "supabase" })
				.then((token) => setToken(token || ""))
				.finally(() => {
					refetch();
				});
		}
	}, [session, isLoaded, isSignedIn, token]);

	const { ref, entry } = useIntersection({
		threshold: 0.1
	});

	useEffect(() => {
		if (entry?.isIntersecting && hasNextPage) {
			fetchNextPage();
		}
	}, [entry?.isIntersecting, hasNextPage, fetchNextPage]);

	if (isError) return <div>Error: {error.message}</div>;
	if (!userData?.user) return <div>Error: user not found</div>;

	return (
		<div className="container grid grid-cols-12">
			<UserProfileCard user={userData.user} />

			<section className="col-span-12 lg:col-span-8 lg:pl-2 xl:col-span-9" aria-labelledby="user-posts">
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
									const isLastELement =
										index === page.posts.edges.length - 1 && pageIndex === data.pages.length - 1;

									return (
										<PostCard
											key={edge.node.id}
											post={edge.node}
											onBananaClick={() => {}}
											ref={isLastELement ? ref : null} // fetch new page when the last element is about to be visible
										/>
									);
								})
							)}
							<div className="mt-2 w-full text-center">
								{isPending && "Loading..."}
								{!hasNextPage && "You've reached the end!"}
							</div>
						</div>
					</TabsContent>
					<TabsContent value="shares">
						<div>TODO</div>
					</TabsContent>
				</Tabs>
			</section>
		</div>
	);
}
