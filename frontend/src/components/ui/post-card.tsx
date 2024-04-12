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

import { formatTimestamp } from "@/lib/utils";
import { formatDistance } from "date-fns";
import {
	AlertTriangleIcon,
	BananaIcon,
	CrownIcon,
	EllipsisIcon,
	MessageSquare,
	PencilIcon,
	ShareIcon,
	Trash2Icon
} from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

import { useState } from "react";
import MarkdownViewer from "./markdown-viewer";

import confetti from "canvas-confetti";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import type { TConductorInstance } from "react-canvas-confetti/dist/types";
interface Post {
	id: string;
	content: string;
	timestamp: Date;
	username: string;
	displayName: string;
	avatarUrl: string;
	avatarFallback: string;
	canEdit: boolean;
	canDelete: boolean;
}

interface PostCardProps {
	post: Post;
}

function BananaLikeButton() {
	const [bananaLiked, setBananaLiked] = useState(false);
	const [confettiInstance, setconfettiInstance] = useState<{
		confetti: confetti.CreateTypes;
		conductor: TConductorInstance;
	}>();

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
					origin: { x: xScale, y: yScale },
					shapes: [bananaShape],
					colors: ["#ff0000", "#00ff00", "#0000ff"]
				});
			}

			return !prev;
		});
	};

	return (
		<Button onClick={handleClick} className="rounded-full" variant="ghost" size="icon">
			<BananaIcon fill={bananaLiked ? "yellow" : undefined} className="h-6 w-6" />

			<Realistic
				onInit={(confetti) => {
					setconfettiInstance(confetti);
				}}
			/>
		</Button>
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
export default function PostCard({ post }: PostCardProps) {
	return (
		<Card>
			<article className="flex flex-row items-start gap-x-4 p-4">
				<div className="flex flex-col items-center gap-y-2">
					<Avatar>
						<AvatarImage src={post.avatarUrl} alt={`@${post.username}`} />
						<AvatarFallback>{post.avatarFallback}</AvatarFallback>
					</Avatar>

					<PostOptionsButton canEdit={post.canEdit} canDelete={post.canDelete} />
				</div>

				<div className="relative w-full">
					{/* Post header */}
					<div className="relative mb-1 flex w-full max-w-full flex-row items-center gap-x-2 overflow-hidden leading-none tracking-tight">
						<div className="flex flex-col">
							<h3 className="text-md flex items-center font-semibold">
								<Tooltip>
									<TooltipContent>Admin</TooltipContent>
									<TooltipTrigger>
										<CrownIcon className="h-4 w-4 text-yellow-400" />
									</TooltipTrigger>
								</Tooltip>
								<span className="select-none">&nbsp;</span>
								<span className="break-all">{post.displayName}</span>
							</h3>

							<div className="flex flex-row items-center">
								<span className="text-sm text-muted-foreground">@{post.username}</span>
								<span>&nbsp;·&nbsp;</span>
								<Tooltip>
									<TooltipContent>{formatTimestamp(post.timestamp)}</TooltipContent>
									<TooltipTrigger className="text-sm text-muted-foreground">
										<time dateTime={formatTimestamp(post.timestamp)} className="select-text">
											{formatDistance(post.timestamp, new Date(), {
												addSuffix: true
											})}
										</time>
									</TooltipTrigger>
								</Tooltip>
							</div>
						</div>
					</div>

					{/* Post content */}
					<section>
						<MarkdownViewer>{post.content}</MarkdownViewer>
					</section>

					{/* <Separator className="mb-2 mt-4" /> */}

					<section className="mt-4 flex w-full">
						{/* Post actions */}
						<Button className="rounded-full" variant="ghost" size="icon">
							<MessageSquare className="h-6 w-6" />
						</Button>
						<BananaLikeButton />
						<div className=" ml-auto flex flex-row items-center gap-x-2">
							<Button className="rounded-full" variant="ghost" size="icon">
								<ShareIcon className="h-6 w-6" />
							</Button>
						</div>
					</section>
				</div>
			</article>
		</Card>
	);
}
