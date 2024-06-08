import { useRouter } from "next/router";
import PostCard from "@/components/ui/post-card";
import { Comment, Post } from "@/gql/graphql";
import { usePost } from "@/lib/hooks/data-hooks/use-post";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useEffect } from "react";
import { useComments } from "@/lib/hooks/data-hooks/use-comments";
import { useSocket } from "@/lib/hooks/socket-hooks/use-socket";
import { useSession } from "@clerk/nextjs";
import CommentCard from "@/components/ui/comment-card";
import Link from "@tiptap/extension-link";
import ProfileCard from "@/components/ui/profile-card";

export default function PostPage() {
	const router = useRouter();
	const postId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

	const { data: postData, isError, error, refetch: refetchPost } = usePost(parseInt(postId || "0"));
	const { data: commentData, refetch } = useComments(parseInt(postId || "0"));

	const { isSignedIn } = useSession();

	const editor = useEditor({
		editorProps: {
			attributes: {
				class: "min-h-min rounded-md border-input bg-transparent px-3 py-2 border-b-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto transition focus:translate-y-1.5"
			}
		},
		extensions: [
			Markdown,
			StarterKit.configure({
				orderedList: {
					HTMLAttributes: {
						class: "list-decimal pl-4"
					}
				},
				bulletList: {
					HTMLAttributes: {
						class: "list-disc pl-4"
					}
				}
			}),
			Link,
			Placeholder.configure({
				placeholder: "Write down your reply"
			})
		],
		content: ""
	});

	const socket = useSocket();

	// Couldn't bother to properly integrate React Query and Socket.io
	useEffect(() => {
		socket.on("createComment", () => {
			refetch();
		});

		socket.on("editComment", () => {
			refetch();
		});

		socket.on("deleteComment", () => {
			refetch();
		});
	}, []);

	if (isError) return <div className="container">Error: {error.message}</div>;
	if (!postData?.post) return <div className="container">Error: Post not found</div>;

	return (
		<div className="container grid grid-cols-12">
			<ProfileCard userId={postData.post.user.id} hiddenInMobile={true}/>
			<div className="relative col-span-12 flex flex-col gap-y-2 overflow-auto lg:col-span-8 xl:col-span-9">
				<PostCard
					post={postData.post as Post}
					onEdit={() => {
						refetchPost();
					}}
					onDelete={() => {
						refetchPost();
					}}
				/>
				{editor ? (
					<div className="border-1 flex flex-col rounded-md border p-2">
						<EditorContent editor={editor} />
						<div className="ml-auto flex">
							<Button
								size="sm"
								variant="ghost"
								disabled={!isSignedIn}
								onClick={() => {
									if (editor.getText()) {
										socket.emit("createComment", { postId, content: editor.getText() });
										editor.commands.clearContent();
									}
								}}
							>
								<Send className="h-4 w-4" />
							</Button>
						</div>
					</div>
				) : (
					<div className="flex h-full flex-col justify-evenly rounded-md border border-input bg-transparent p-1">
						<Skeleton className="h-16 rounded-lg" />
						<Skeleton className="h-8 rounded-lg" />
					</div>
				)}
				{commentData?.comments?.map((comment) => (
					<CommentCard
						key={`comment_${comment.id}`}
						comment={comment as Comment}
						onEdit={(newComment) => {
							socket.emit("editComment", newComment);
						}}
						onDelete={(commentId) => {
							socket.emit("deleteComment", commentId);
						}}
					/>
				))}
			</div>
		</div>
	);
}
