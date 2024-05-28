import { Comment } from "@/gql/graphql";
import { Card } from "./card";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { format, formatDistance } from "date-fns";
import MarkdownViewer from "./markdown-viewer";
import { OPTION_TYPE, OptionsButton } from "./options-button";
import { BananaLikeButton } from "./banana-button";

interface CommentCardProps {
	comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
	return (
		<Card>
			<article className="flex flex-row items-center gap-x-4 p-4">
				<Link href={`/profiles/${comment.user.id}`}>
					<Avatar>
						<AvatarImage src={comment.user.profile_picture} alt={`@${comment.user.username}`} />
						<AvatarFallback>{comment.user.username.substring(0, 2)}</AvatarFallback>
					</Avatar>
				</Link>

				<div className="relative w-full">
					{/* Comment header */}
					<div className="relative mb-1 flex w-full max-w-full flex-row items-center gap-x-2 overflow-hidden leading-none tracking-tight">
						<div className="flex w-full flex-col">
							<h3 className="text-md flex flex-row font-semibold">
								<Link href={`/profiles/${comment.user.id}`}>
									<span className="break-all hover:underline">{comment.user.username}</span>
								</Link>
								{comment.user.is_owner && (
									<OptionsButton data={comment} optionType={OPTION_TYPE.COMMENT} />
								)}
							</h3>

							<div className="flex flex-row">
								<Link href={`/profiles/${comment.user.id}`}>
									<span className="text-sm text-muted-foreground">@{comment.user.username}</span>
								</Link>
								<span>&nbsp;·&nbsp;</span>
								<Tooltip>
									<TooltipContent>{format(comment.created_at, "do MMM yyyy ppp")}</TooltipContent>
									<TooltipTrigger className="text-sm text-muted-foreground">
										<time
											dateTime={format(comment.created_at, "do MMM yyyy ppp")}
											className="select-text"
										>
											{formatDistance(comment.created_at, new Date(), {
												addSuffix: true
											})}
										</time>
									</TooltipTrigger>
								</Tooltip>
							</div>
						</div>
					</div>

					{/* Comment content */}
					<section aria-labelledby="comment-content">
						<MarkdownViewer>{comment.content}</MarkdownViewer>
					</section>

					<section aria-labelledby="post actions" className="mt-4 flex w-full items-center gap-x-2">
						<BananaLikeButton
							id={comment.id}
							userLiked={comment.user_liked}
							likeCount={comment.likes}
							isComment={true}
						/>
					</section>
				</div>
			</article>
		</Card>
	);
}
