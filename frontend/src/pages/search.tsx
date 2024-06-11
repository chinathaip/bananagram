import { Input } from "@/components/ui/input";
import PostCard from "@/components/ui/post-card";
import PostCardSkeleton from "@/components/ui/skeletons/post-card-skeleton";
import { Post } from "@/gql/graphql";
import { useSearchPost } from "@/lib/hooks/data-hooks/use-search-post.ts";
import { useDebouncedValue } from "@mantine/hooks";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchPage() {
	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(searchParams.get("q"));
	const [debounceSearchValue] = useDebouncedValue(searchQuery, 500);
	const { data, isLoading } = useSearchPost(debounceSearchValue || "");

	return (
		<div className="container mx-auto items-center">
			<Input
				className="mt-2"
				value={searchQuery || ""}
				onChange={(e) => {
					setSearchQuery(e.target.value);
				}}
				placeholder="inspiring posts, technology related post, a post by chinathai"
			/>
			<p className="mt-4 text-xl">Search results:</p>
			<div className="mt-4 flex flex-col gap-y-2">
				{debounceSearchValue !== "" && isLoading && Array.from({ length: 5 }).map(() => <PostCardSkeleton />)}
				{data?.search && data?.search?.length > 0 ? (
					data?.search.map((post) => <PostCard post={post as Post} onDelete={() => {}} onEdit={() => {}} />)
				) : (
					<div className="text-center">No posts found</div>
				)}
			</div>
		</div>
	);
}
