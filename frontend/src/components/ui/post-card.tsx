import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { format, formatDistance } from "date-fns";
import {
	AlertTriangleIcon,
	BananaIcon,
	CrownIcon,
	EllipsisIcon,
	MessageCircleIcon,
	PencilIcon,
	ShareIcon,
	Trash2Icon
} from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

import { forwardRef, useState } from "react";
import MarkdownViewer from "./markdown-viewer";

import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import Link from "next/link";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import type { TConductorInstance } from "react-canvas-confetti/dist/types";

import type { Post } from "@/gql/graphql";

interface PostCardProps {
	post: Post;
	onBananaClick: (postId: number) => void;
	ref: any;
}

function BananaLikeButton({ likeCount, onBananaClick }: { likeCount: number; onBananaClick: () => void }) {
	const [bananaLiked, setBananaLiked] = useState(false);
	const [confettiInstance, setconfettiInstance] = useState<{
		confetti: confetti.CreateTypes;
		conductor: TConductorInstance;
	}>();

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onBananaClick();
		// Get the button's position relative to the viewport
		const { width, height, x, y } = event.currentTarget.getBoundingClientRect();

		const xScale = (x + width / 2) / window.innerWidth;
		const yScale = (y + height / 2) / window.innerHeight;

		const scalar = 4;

		setBananaLiked((prev) => {
			if (!prev) {
				// This has to be here because the confetti instance is not available on the first render
				const bananaShape = confetti.shapeFromText({ text: "🍌", scalar });

				confettiInstance?.confetti({
					particleCount: 10,
					scalar,
					spread: 75,
					startVelocity: 30,
					origin: { x: xScale, y: yScale },
					shapes: [bananaShape],
					colors: ["#ff0000", "#00ff00", "#0000ff"]
				});
			}

			return !prev;
		});
	};

	return (
		// Again, we are not using the Button component here because we just need this to be clickable, without any other styling.
		<button
			onClick={handleClick}
			className={cn(
				"group flex flex-row items-center rounded-full",
				bananaLiked ? "text-primary" : "text-muted-foreground"
			)}
			aria-label="like post"
		>
			<BananaIcon
				className={cn(
					"h-5 w-5 transition-all duration-150 group-hover:text-accent-foreground",
					bananaLiked ? "fill-yellow-400" : ""
				)}
			/>
			<span>&nbsp;</span>
			{/* TODO: Like count */}
			<span className="text-sm transition-all duration-150 group-hover:text-accent-foreground">
				{Intl.NumberFormat("en-US", {
					notation: "compact"
				}).format(likeCount)}
			</span>

			<Realistic
				onInit={(confetti) => {
					setconfettiInstance(confetti);
				}}
			/>
		</button>
	);
}

// This disables scroll when activated, and there is an issue with
// the content being misaligned since the width of the scrollbar is not accounted for.
// Example: https://streamable.com/ysbe7b
function PostOptionsButton({ canEdit, canDelete }: { canEdit: boolean; canDelete: boolean }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<EllipsisIcon className="h-6 w-6" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Post Options</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{canEdit && (
						<DropdownMenuItem>
							<PencilIcon className="mr-2 h-4 w-4" />
							<span>Edit</span>
						</DropdownMenuItem>
					)}
					{canDelete && (
						<DropdownMenuItem className="text-red-700">
							<Trash2Icon className="mr-2 h-4 w-4" />
							<span>Delete</span>
						</DropdownMenuItem>
					)}

					<DropdownMenuItem>
						<AlertTriangleIcon className="mr-2 h-4 w-4" />
						<span>Report</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// TODO: find a better name for this component. It's a card, for a post... "PostCard" is rather misleading.
// Possible other names: "TweetCard", "StatusCard", "CardPost", etc..
function PostCard({ post, onBananaClick }: PostCardProps, ref: any) {
	return (
		<Card ref={ref}>
			<article className="flex flex-row items-start gap-x-4 p-4">
				<div className="flex flex-col items-center gap-y-2">
					<Link href={`/profiles/${post.user.username}`}>
						<Avatar>
							{/* TODO: check if there is any nextjs specific thing with this, */}
							{/* since next usually complains about using <img> tags and not its Image component from next/link  */}
							<AvatarImage src={post.user.profile_picture} alt={`@${post.user.username}`} />
							<AvatarFallback>{post.user.username.substring(0, 2)}</AvatarFallback>
						</Avatar>
					</Link>

					{/* <PostOptionsButton canEdit={post.canEdit} canDelete={post.canDelete} /> */}
					{/* TODO: make these work */}
					<PostOptionsButton canEdit={false} canDelete={false} />
				</div>

				<div className="relative w-full">
					{/* Post header */}
					<div className="relative mb-1 flex w-full max-w-full flex-row items-center gap-x-2 overflow-hidden leading-none tracking-tight">
						<div className="flex flex-col">
							<h3 className="text-md flex items-center font-semibold">
								{/* TODO: role badges and stuff */}
								<Tooltip>
									<TooltipContent>Admin</TooltipContent>
									<TooltipTrigger>
										<CrownIcon className="h-4 w-4 text-yellow-400" />
									</TooltipTrigger>
								</Tooltip>
								<span className="select-none">&nbsp;</span>
								<Link href={`/profiles/${post.user.id}`}>
									<span className="break-all hover:underline">
										{post.user.display_name || post.user.username}
									</span>
								</Link>
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
						{/* Post actions */}
						{/* <Button className="rounded-full" variant="ghost">
							<MessageSquare className="h-6 w-6" />
						</Button> */}

						{/* We are not using the Button component here because we just need this to be clickable, without any other styling. */}
						{/* Mostly to combat alignment issues and to use semantic html. It can easily be a div. */}
						<button
							className="group flex flex-row items-center text-sm text-muted-foreground"
							aria-label="comment on post"
						>
							<MessageCircleIcon className="h-5 w-5 transition-all duration-150 group-hover:text-accent-foreground" />
							{/* TODO: probably find all instances of this type of thing and make it a component */}
							<span className="select-none">&nbsp;</span>

							{/* TODO: comments count */}
							<span className="transition-all duration-150 group-hover:text-accent-foreground">
								{Intl.NumberFormat("en-US", {
									notation: "compact"
								}).format(1100)}
							</span>
						</button>

						<BananaLikeButton
							likeCount={post.likes}
							onBananaClick={() => {
								onBananaClick(post.id);
							}}
						/>

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
