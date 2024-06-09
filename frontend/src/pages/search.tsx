import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
	const searchParams = useSearchParams();

	const [searchQuery, setSearchQuery] = useState(searchParams.get("q"));

	useEffect(() => {
		// TODO: call backend api
	}, [searchQuery]);

	return <div>Hello World: {searchQuery}</div>;
}
