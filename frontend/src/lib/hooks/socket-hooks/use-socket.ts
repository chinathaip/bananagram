import { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { useSession } from "@clerk/nextjs";

export function useSocket() {
	const { session } = useSession();
	const [token, setToken] = useState("");

	useEffect(() => {
		session?.getToken({ template: "supabase" }).then((token) => setToken(token || ""));
	}, [session]);

	const socket = useMemo(() => {
		return io(process.env.NEXT_PUBLIC_BACKEND_URL ?? "", {
			transports: ["websocket"],
			query: {
				authorization: token
			}
		});
	}, [token]);

	return socket;
}
