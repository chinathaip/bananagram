import { usePost } from "@/lib/hooks/data-hooks/use-post";
import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const examplePosts = [
	{
		id: "post123",
		content:
			"Lorem ipsum dolor sit **amet** consectetur, adipisicing elit. Quae hic tempore asperiores tenetur velit pariatur, iusto rem. Corrupti ex illum commodi, aut tenetur nisi magnam porro magni! Fugiat, mollitia? _Animi_ officiis numquam fugiat voluptates quasi laudantium reprehenderit totam dolores expedita! [Link](https://example.com)",
		timestamp: new Date("2024-04-11T15:00:00Z"), // Example timestamp
		username: "chinathai",
		displayName: "ChinathaiP",
		avatarUrl: "https://github.com/chinathaip.png",
		avatarFallback: "CP",
		canEdit: true,
		canDelete: true
	},
	{
		id: "post124",
		content: "Lorem short! __Kek__",
		timestamp: new Date("2024-04-11T15:00:00Z"), // Example timestamp
		username: "shadcn",
		displayName: "shad",
		avatarUrl: "https://github.com/shadcn.png",
		avatarFallback: "SC",
		canEdit: false,
		canDelete: false
	}
];

export default function Home() {
	// const { isPending, error, data } = useRepoStats("TanStack/query");

	// if (error) return <div>Error: {error.message}</div>;

	const [postId, setPostId] = useState(1);

	const { data, isError, isPending } = usePost(postId);
	const { isSignedIn, session, isLoaded } = useSession();

	useEffect(() => {
		if (isLoaded && isSignedIn) {
			session
				.getToken({
					template: "supabase"
				})
				.then((token) => {
					console.log(token);
				});
		}
	}, [session]);

	return (
		<div className="container mx-auto grid grid-cols-12">
			<div className="relative hidden md:col-span-3 md:block">
				{/* TODO: add new post here, and in the header when going below the md breakpoint */}
				This space is for stuff like "New Post" on Desktops. Will be sticky.
			</div>
			{/* TODO: don't forget to remove h-screen, make this scrollable since it's the main content */}
			<div className="relative col-span-12 flex h-screen flex-col gap-y-2 md:col-span-9">
				{/* <PostEditor />

				{examplePosts.map((post) => (
					<PostCard key={`post_card_` + post.id} post={post} />
				))} */}

				{/* <PostCardSkeleton /> */}
				{/* <pre>{isPending ? "Loading..." : JSON.stringify(data, null, 2)}</pre> */}

				<input type="number" value={postId} onChange={(e) => setPostId(parseInt(e.target.value))} />
				<pre>{isPending ? "Loading..." : isError ? "ERR" : JSON.stringify(data, null, 2)}</pre>
			</div>
		</div>
	);
}
