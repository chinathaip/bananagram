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
import { Comment, Post } from "@/gql/graphql";
import { useState } from "react";

export enum OPTION_TYPE {
	POST,
	COMMENT
}

export function OptionsButton({ data, optionType }: { data: Post | Comment; optionType: OPTION_TYPE }) {
	const [open, setOpen] = useState(false);
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild className="ml-auto">
				<button>
					<EllipsisIcon className="h-6 w-6" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Post Options</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<div className="flex flex-col">
					<Dialog open={open} onOpenChange={setOpen}>
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
										currentPostData={data as Post}
										onSuccessCallBack={() => {
											setOpen(false);
										}}
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
									This action cannot be undone. This will permanently delete your account and remove
									your data from our servers.
								</DialogDescription>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
