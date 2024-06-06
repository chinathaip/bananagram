import { BananaIcon } from "lucide-react";

import { useState } from "react";

import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import type { TConductorInstance } from "react-canvas-confetti/dist/types";

import { useLikePost } from "@/lib/hooks/data-hooks/use-like-post";
import { useUnlikePost } from "@/lib/hooks/data-hooks/use-unlike-post";
import { useLikeComment } from "@/lib/hooks/data-hooks/use-like-comment";
import { useUnlikeComment } from "@/lib/hooks/data-hooks/use-unlike-comment";
import { useSession } from "@clerk/nextjs";

export function BananaLikeButton({
	id,
	likeCount,
	userLiked,
	isComment
}: {
	id: number;
	likeCount: number;
	userLiked: boolean;
	isComment?: boolean;
}) {
	const [bananaCount, setBananaCount] = useState(likeCount);
	const [bananaLiked, setBananaLiked] = useState(userLiked);
	const [confettiInstance, setconfettiInstance] = useState<{
		confetti: confetti.CreateTypes;
		conductor: TConductorInstance;
	}>();
	const { mutateAsync: likePost } = useLikePost();
	const { mutateAsync: unlikePost } = useUnlikePost();
	const { mutateAsync: likeComment } = useLikeComment();
	const { mutateAsync: unlikeComment } = useUnlikeComment();

	const { isSignedIn } = useSession();

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		// Get the button's position relative to the viewport
		const { width, height, x, y } = event.currentTarget.getBoundingClientRect();

		const xScale = (x + width / 2) / window.innerWidth;
		const yScale = (y + height / 2) / window.innerHeight;

		const scalar = 4;

		setBananaLiked((prev) => {
			if (!id) {
				return prev;
			}

			if (!prev) {
				if (isComment) {
					likeComment(id)
						.then((result) => {
							setBananaCount(result.likeComment.likes);
						})
						.catch(console.error);
				} else {
					likePost(id)
						.then((result) => {
							setBananaCount(result.likePost.likes);
						})
						.catch(console.error);
				}

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
			} else {
				if (isComment) {
					unlikeComment(id)
						.then((result) => {
							setBananaCount(result.unlikeComment.likes);
						})
						.catch(console.error);
				} else {
					unlikePost(id)
						.then((result) => {
							setBananaCount(result.unlikePost.likes);
						})
						.catch(console.error);
				}
			}

			return !prev;
		});
	};

	return (
		// Again, we are not using the Button component here because we just need this to be clickable, without any other styling.
		<button
			onClick={handleClick}
			disabled={!isSignedIn}
			className={cn(
				"group flex flex-row items-center rounded-full",
				bananaLiked ? "text-primary" : "text-muted-foreground"
			)}
			aria-label="like post"
		>
			<BananaIcon className={cn("h-5 w-5 transition-all duration-150", bananaLiked ? "fill-yellow-400" : "")} />
			<span>&nbsp;</span>
			<span
				className={`text-sm transition-all duration-150 ${isSignedIn ? "group-hover:text-accent-foreground" : ""}`}
			>
				{Intl.NumberFormat("en-US", {
					notation: "compact"
				}).format(bananaCount)}
			</span>

			<Realistic
				onInit={(confetti) => {
					setconfettiInstance(confetti);
				}}
			/>
		</button>
	);
}
