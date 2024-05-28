import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, formatDistance } from "date-fns";
import { CrownIcon, MessageCircleIcon, ShareIcon } from "lucide-react";
import { Card } from "./card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { forwardRef } from "react";
import MarkdownViewer from "./markdown-viewer";
import Link from "next/link";
import type { Post } from "@/gql/graphql";
import { OPTION_TYPE, OptionsButton } from "./options-button";
import { BananaLikeButton } from "./banana-button";

interface PostCardProps {
	post: Post;
	ref: any;
}

// TODO: find a better name for this component. It's a card, for a post... "PostCard" is rather misleading.
// Possible other names: "TweetCard", "StatusCard", "CardPost", etc..
function PostCard({ post }: PostCardProps, ref: any) {
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
									<TooltipContent>{format(post.created_at, "do MMM yyyy ppp")}</TooltipContent>
									<TooltipTrigger className="text-sm text-muted-foreground">
										<time
											dateTime={format(post.created_at, "do MMM yyyy ppp")}
											className="select-text"
										>
											{formatDistance(post.created_at, new Date(), {
												addSuffix: true
											})}
										</time>
									</TooltipTrigger>
								</Tooltip>
							</div>
						</div>
					</div>

					{/* Post content */}
					<section aria-labelledby="post-content">
						<MarkdownViewer>{post.content}</MarkdownViewer>
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
							<button
								className="text-muted-foreground transition-all duration-150 hover:text-accent-foreground"
								aria-label="share post"
							>
								<ShareIcon className="h-5 w-5" />
							</button>
						</div>
					</section>
				</div>
			</article>
		</Card>
	);
}

export default forwardRef(PostCard);
