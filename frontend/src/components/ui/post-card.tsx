import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, formatDistance } from "date-fns";
import { CrownIcon, MessageCircleIcon, ShareIcon } from "lucide-react";
import { Card } from "./card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { forwardRef, useState } from "react";
import MarkdownViewer from "./markdown-viewer";
import Link from "next/link";
import type { Comment, Post } from "@/gql/graphql";
import { OPTION_TYPE, OptionsButton } from "./options-button";
import { BananaLikeButton } from "./banana-button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { Skeleton } from "./skeleton";
import { Button } from "./button";
import CommentCard from "./comment-card";
import Image from "next/image";
import { Link as TiptapLink } from "@tiptap/extension-link";
import { useSharePost } from "@/lib/hooks/data-hooks/user-share-post";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

interface PostCardProps {
	post: Post;
	onDelete: () => void;
	onEdit: () => void;
	ref: any;
}

// TODO: find a better name for this component. It's a card, for a post... "PostCard" is rather misleading.
// Possible other names: "TweetCard", "StatusCard", "CardPost", etc..
function PostCard({ post, onEdit, onDelete }: PostCardProps, ref: any) {
	const { mutate: sharePost } = useSharePost();
	const { user, isSignedIn } = useUser();
	const [openShareDialog, setOpenShareDialog] = useState(false);
	const router = useRouter();
	const editor = useEditor({
		editorProps: {
			attributes: {
				class: "min-h-36 max-h-48 rounded-md rounded-br-none rounded-bl-none border-input bg-transparent px-3 py-2 border-b-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto"
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
			TiptapLink,
			Placeholder.configure({
				placeholder: "What are your thoughts?"
			})
		],
		content: ""
	});

	return (
		<Card ref={ref}>
			<article className="flex flex-row items-start gap-x-4 p-4">
				<div className="flex flex-col items-center gap-y-2">
					<Link href={`/profiles/${post.user.id}`}>
						<Avatar>
							{/* TODO: check if there is any nextjs specific thing with this, */}
							{/* since next usually complains about using <img> tags and not its Image component from next/link  */}
							<AvatarImage src={post.user.profile_picture} alt={`@${post.user.username}`} />
							<AvatarFallback>{post.user.username.substring(0, 2)}</AvatarFallback>
						</Avatar>
					</Link>
				</div>

				<div className="relative w-full">
					{/* Post header */}
					<div className="relative mb-1 flex w-full max-w-full flex-row items-center gap-x-2 overflow-hidden leading-none tracking-tight">
						<div className="flex w-full flex-col">
							<h3 className="text-md flex items-center font-semibold">
								{/* TODO: role badges and stuff */}
								{post.user.is_owner && (
									<Tooltip>
										<TooltipContent>You</TooltipContent>
										<TooltipTrigger>
											<CrownIcon className="h-4 w-4 text-yellow-400" />
										</TooltipTrigger>
									</Tooltip>
								)}
								<span className="select-none">&nbsp;</span>
								<Link href={`/profiles/${post.user.id}`}>
									<span className="break-all hover:underline">{post.user.username}</span>
								</Link>
								{post.user.is_owner && (
									<div className="ml-auto">
										<OptionsButton
											key={`post_option_${post.id}`}
											data={post}
											optionType={OPTION_TYPE.POST}
											onEdit={() => onEdit()}
											onDelete={() => onDelete()}
										/>
									</div>
								)}
							</h3>

							<div className="flex flex-row items-center">
								<Link href={`/profiles/${post.user.id}`}>
									<span className="text-sm text-muted-foreground">@{post.user.username}</span>
								</Link>
								<span>&nbsp;·&nbsp;</span>
								<Tooltip>
									<TooltipContent>
										Created: {format(post.created_at, "do MMM yyyy ppp")} <br />
										{post.updated_at && `Edited: ${format(post.updated_at, "do MMM yyyy ppp")}`}
									</TooltipContent>
									<TooltipTrigger className="text-sm text-muted-foreground">
										{post.updated_at && "edited "}
										<time
											dateTime={format(
												post.updated_at ? post.updated_at : post.created_at,
												"do MMM yyyy ppp"
											)}
											className="select-text"
										>
											{formatDistance(
												post.updated_at ? post.updated_at : post.created_at,
												new Date(),
												{
													addSuffix: true
												}
											)}
										</time>
									</TooltipTrigger>
								</Tooltip>
							</div>
						</div>
					</div>

					{/* Post content */}
					<section aria-labelledby="post-content">
						<MarkdownViewer>{post.content}</MarkdownViewer>

						{/* TODO: the backend supports multiple image, frontend just needs to align them properly */}
						<div className="mt-2 flex max-h-max flex-row gap-x-2">
							{post.medias.length > 0 &&
								post.medias.map((media, index) => (
									<Image
										src={media.url}
										alt={`image ${index} for post ${post.id}`}
										width={500}
										height={500}
										priority
									/>
								))}
						</div>
					</section>

					{/* <Separator className="mb-2 mt-4" /> */}

					<section aria-labelledby="post actions" className="mt-4 flex w-full items-center gap-x-2">
						{/* We are not using the Button component here because we just need this to be clickable, without any other styling. */}
						{/* Mostly to combat alignment issues and to use semantic html. It can easily be a div. */}
						<Link href={`/posts/${post.id}`}>
							<button
								className="group flex flex-row items-center text-sm text-muted-foreground"
								aria-label="comment on post"
							>
								<MessageCircleIcon className="h-5 w-5 transition-all duration-150 group-hover:text-accent-foreground" />
								{/* TODO: probably find all instances of this type of thing and make it a component */}
								<span className="select-none">&nbsp;</span>

								<span className="transition-all duration-150 group-hover:text-accent-foreground">
									{Intl.NumberFormat("en-US", {
										notation: "compact"
									}).format(post.comments)}
								</span>
							</button>
						</Link>

						<BananaLikeButton id={post.id} likeCount={post.likes} userLiked={post.user_liked} />

						{/* TODO: share post */}
						<div className=" ml-auto flex flex-row items-center gap-x-2">
							<Dialog
								open={openShareDialog}
								onOpenChange={(open) => {
									if (!isSignedIn) {
										router.push("/sign-in");
										return;
									}
									if (post.user_shared) {
										toast.error("You have already shared this post.");
										setOpenShareDialog(false);
										return;
									}
									setOpenShareDialog(open);
								}}
							>
								<DialogTrigger>
									<button
										hidden={post.user_id === user?.id}
										className="text-muted-foreground transition-all duration-150 hover:text-accent-foreground"
										aria-label="share post"
									>
										<ShareIcon className="h-5 w-5" />
									</button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Share Post</DialogTitle>
									</DialogHeader>

									{editor ? (
										<>
											<div className="truncate">
												<EditorContent editor={editor} />
											</div>
											{/* HACK: avoid forward ref problem when use post-card */}
											<CommentCard
												comment={{ ...post, post_id: post.id } as Comment}
												onEdit={() => {}}
												onDelete={() => {}}
											/>
										</>
									) : (
										<div className="flex h-full flex-col justify-evenly rounded-md border border-input bg-transparent p-1">
											<Skeleton className="h-16 rounded-lg" />
											<Skeleton className="h-8 rounded-lg" />
										</div>
									)}

									<DialogFooter>
										<Button
											onClick={() => {
												sharePost(
													{
														postId: post.id,
														content: editor?.storage.markdown.getMarkdown()
													},
													{
														onSuccess: () => {
															toast.success("Post has sucessfully been shared.");
														},
														onError: (error) => {
															toast.error("There was an error while sharing the post.", {
																description: error.message
															});
														}
													}
												);
												setOpenShareDialog(false);
											}}
										>
											Share
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</section>
				</div>
			</article>
		</Card>
	);
}

export default forwardRef(PostCard);
