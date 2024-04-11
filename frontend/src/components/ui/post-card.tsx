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
import { formatDistance, subHours } from "date-fns";
import { CrownIcon, EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

function PostOptionsButton() {
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
					{/* TODO: only show edit if the owner of post is the logged in user */}
					<DropdownMenuItem>
						<PencilIcon className="mr-2 h-4 w-4" />
						<span>Edit</span>
					</DropdownMenuItem>

					{/* TODO: impl, and modal confirmation */}
					<DropdownMenuItem className="text-red-700">
						<Trash2Icon className="mr-2 h-4 w-4" />
						<span>Delete</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// TODO: find a better name for this component. It's a card, for a post... "PostCard" is rather misleading.
// Possible other names: "TweetCard", "StatusCard", "CardPost", etc..
export default function PostCard() {
	return (
		<Card>
			<div className="flex flex-row items-start gap-x-4 p-4">
				{/* This mt-2 is here to push the avatar down a bit so it aligns with the title / username stuff */}
				{/* It's not an elegant solution by ay means, and it's still offsetted by a pixel so...  */}
				{/* TODO: properly style and align this. */}
				{/* Though, Twitter's is off by 3 pixels so we're not that far off either! */}
				<div className="mt-2 flex flex-col items-center gap-y-2">
					<Avatar>
						<AvatarImage src="https://github.com/chinathaip.png" alt="@shadcn" />
						<AvatarFallback>CP</AvatarFallback>
					</Avatar>

					<PostOptionsButton />
				</div>

				<div className="relative w-full">
					{/* Post header */}
					<div className="relative mb-1 flex w-full max-w-full flex-row items-center gap-x-2 overflow-hidden leading-none tracking-tight">
						<div className="flex flex-col">
							<div className="text-md items-center font-semibold">
								<TooltipProvider delayDuration={300}>
									<Tooltip>
										<TooltipContent>Admin</TooltipContent>
										<TooltipTrigger>
											<CrownIcon className="h-4 w-4 text-yellow-400" />
										</TooltipTrigger>
									</Tooltip>
								</TooltipProvider>
								&nbsp;
								<span className="break-all">ChinathaiP</span>
								{/* We *could* put the options in the post header's top right to make it be in a more standard place, and it'll fit, 
                                    but it also might not under some circumstances. i.e., long usernames + tags, etc.
                                    Twitter just cuts off part of the username.
                                    https://i.imgur.com/ZNBUTIe.png
                                */}
							</div>

							<div className="flex flex-row items-center">
								<span className="text-sm text-muted-foreground">@chinathai</span>
								<span>&nbsp;·&nbsp;</span>
								<TooltipProvider delayDuration={300}>
									<Tooltip>
										<TooltipContent>{formatTimestamp(subHours(new Date(), 3))}</TooltipContent>
										<TooltipTrigger className="text-sm text-muted-foreground">
											<span className="select-text">
												{formatDistance(subHours(new Date(), 3), new Date(), {
													addSuffix: true
												})}
											</span>
										</TooltipTrigger>
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>
					</div>

					{/* Post content */}
					<p className="text-sm">
						Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae hic tempore asperiores tenetur
						velit pariatur, iusto rem. Corrupti ex illum commodi, aut tenetur nisi magnam porro magni!
						Fugiat, mollitia? Animi officiis numquam fugiat voluptates quasi laudantium reprehenderit totam
						dolores expedita!
					</p>
				</div>
			</div>
		</Card>
	);
}
