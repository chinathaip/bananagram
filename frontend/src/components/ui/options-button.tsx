import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { EDITOR_ACTION, PostEditor } from "./post-editor";
import { Post } from "@/gql/graphql";

// This disables scroll when activated, and there is an issue with
// the content being misaligned since the width of the scrollbar is not accounted for.
// Example: https://streamable.com/ysbe7b

export enum OPTION_TYPE {
	POST,
	COMMENT
}

export function OptionsButton({ post, optionType }: { post: Post; optionType: OPTION_TYPE }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="ml-auto">
				<button>
					<EllipsisIcon className="h-6 w-6" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Post Options</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<Dialog>
					<DialogTrigger>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							<PencilIcon className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
					</DialogTrigger>
					<DialogContent>
						{optionType === OPTION_TYPE.POST ? (
							<>
								<DialogHeader>Edit your post</DialogHeader>
								<PostEditor
									editorAction={EDITOR_ACTION.EDIT}
									currentPostData={post}
									onSuccessCallBack={() => {}}
								/>
							</>
						) : (
							<>
								<DialogHeader>Edit your comment</DialogHeader>
							</>
						)}
					</DialogContent>
				</Dialog>

				<Dialog>
					<DialogTrigger>
						<DropdownMenuItem className="text-red-700" onSelect={(e) => e.preventDefault()}>
							<Trash2Icon className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Are you sure absolutely sure?</DialogTitle>
							<DialogDescription>
								This action cannot be undone. This will permanently delete your account and remove your
								data from our servers.
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
