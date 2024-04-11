import { Skeleton } from "../skeleton";

export default function PostCardSkeleton() {
	return (
		<div className="flex space-x-2">
			<Skeleton className="h-12 w-12 rounded-full" />

			<div className="relative w-full space-y-2">
				<Skeleton className="h-4 w-1/5" />
				<Skeleton className="h-4 w-4/5" />
				<Skeleton className="h-4 w-3/5" />
			</div>
		</div>
	);
}
