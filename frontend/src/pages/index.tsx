import PostCard from "@/components/ui/post-card";
import { EDITOR_ACTION, PostEditor } from "@/components/ui/post-editor";
import { useCategory } from "@/lib/hooks/data-hooks/use-category";
import { useInfinitePosts } from "@/lib/hooks/data-hooks/use-infinite-posts";
import { useIntersection } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { Post } from "@/gql/graphql";
import PostCardSkeleton from "@/components/ui/skeletons/post-card-skeleton";
import CategoryMenu from "@/components/ui/category-menu";
import { Dialog, DialogContent, DialogTrigger, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { useSession } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";

export default function Home() {
	const [postCategory, setPostCategory] = useState<string>("");
	const [open, setOpen] = useState<boolean>(false);
	const { data, error, isError, isPending, isFetching, fetchNextPage, hasNextPage, refetch } = useInfinitePosts({
		categoryName: postCategory
	});
	const { data: categoryData } = useCategory();
	const { isSignedIn } = useSession();

	const { ref, entry } = useIntersection({
		threshold: 0.1
	});
	// Use effect to handle fetching next page
	useEffect(() => {
		if (entry?.isIntersecting && !isFetching && hasNextPage) {
			fetchNextPage();
		}
	}, [entry?.isIntersecting, hasNextPage, isFetching, fetchNextPage]);

	if (isError) return <div className="container">Error: {error.message}</div>;

	return (
		<div className="container mx-auto grid grid-cols-12">
			<CategoryMenu onSelectCategory={setPostCategory} />
			<div className="relative col-span-12 flex flex-col gap-y-2 overflow-auto md:col-span-9">
				<div className="flex flex-col gap-y-2">
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button className="w-full py-10" variant="outline" disabled={!isSignedIn}>
								<div className="item-center flex w-full flex-row gap-x-4 text-left text-lg">
									<SquarePen />
									What&apos;s on your mind&#63; {!isSignedIn && "Please sign in to post..."}
								</div>
							</Button>
						</DialogTrigger>
						<DialogContent className="flex flex-col overflow-hidden">
							<DialogHeader>Create new post</DialogHeader>
							{/* HACK: ignore parent padding XD */}
							<Separator className="w-[1000px] -translate-x-1/2 " />

							<PostEditor
								editorAction={EDITOR_ACTION.CREATE}
								onSuccessCallBack={() => {
									setOpen(false);
									refetch();
								}}
							/>
						</DialogContent>
					</Dialog>

					{data?.pages.map((page, pageIndex) =>
						page.posts.edges.map((edge, index) => {
							const isLastElement =
								index === page.posts.edges.length - 1 && pageIndex === data.pages.length - 1;
							return (
								<PostCard
									key={`postcard_${edge.node.id}`}
									post={edge?.node as Post}
									ref={isLastElement ? ref : null}
								/>
							);
						})
					)}
					{isPending &&
						Array.from({ length: 5 }).map((_, index) => (
							<PostCardSkeleton key={`postCardSkeletion_${index}`} />
						))}
					{!hasNextPage && <p className="my-2 text-center">You are all caught up</p>}
				</div>
			</div>
		</div>
	);
}
