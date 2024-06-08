import { EDITOR_ACTION, PostEditor } from "@/components/ui/post-editor";
import { Dialog, DialogContent, DialogTrigger, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useSession } from "@clerk/nextjs";

export default function CreatePostDialog({ onPostCreated }: { onPostCreated: () => void }) {
	const [open, setOpen] = useState<boolean>(false);
	const { isSignedIn } = useSession();
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="w-full py-10" variant="outline" disabled={!isSignedIn}>
					<div className="item-center flex w-full flex-row gap-x-4 text-left text-lg">
						<SquarePen />
						{isSignedIn ? "What's on your mind?" : "Please sign in to post."}
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
						onPostCreated();
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}
