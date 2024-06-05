import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "./dialog";
import { EDITOR_ACTION, PostEditor } from "./post-editor";
import { Comment, Post } from "@/gql/graphql";
import { useState } from "react";
import { Button } from "./button";
import { useDeletePost } from "@/lib/hooks/data-hooks/use-delete-post";
import { toast } from "sonner";
import { CommentEditor } from "./comment-editor";

export enum OPTION_TYPE {
	POST,
	COMMENT
}

interface OptionsButtonProps {
	data: Post | Comment;
	optionType: OPTION_TYPE;
	onEdit?: (data: Post | Comment) => void;
	onDelete?: (id: number) => void;
}

export function OptionsButton({ data, optionType, onEdit, onDelete }: OptionsButtonProps) {
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const { mutate: deletePost } = useDeletePost();
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
					<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
						<DialogTrigger>
							<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
								<PencilIcon className="mr-2 h-4 w-4" />
								Edit
							</DropdownMenuItem>
						</DialogTrigger>
						<DialogContent className="max-w-max">
							{optionType === OPTION_TYPE.POST ? (
								<>
									<DialogHeader>Edit your post</DialogHeader>
									<PostEditor
										editorAction={EDITOR_ACTION.EDIT}
										currentPostData={data as Post}
										onSuccessCallBack={() => {
											setEditDialogOpen(false);
											if (onEdit) onEdit(data);
										}}
									/>
								</>
							) : (
								<>
									<DialogHeader>Edit your comment</DialogHeader>
									{/* TODO: comment editor */}
									<CommentEditor
										currentCommentData={data as Comment}
										onSubmit={(newComment) => {
											if (onEdit) onEdit(newComment);
											setEditDialogOpen(false);
										}}
									/>
								</>
							)}
						</DialogContent>
					</Dialog>

					<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
						<DialogTrigger>
							<DropdownMenuItem className="text-red-700" onSelect={(e) => e.preventDefault()}>
								<Trash2Icon className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Are you absolutely sure?</DialogTitle>
								<DialogDescription>
									You are about to delete your {optionType === OPTION_TYPE.POST ? "post" : "comment"}
									{". "}
									This action cannot be undone.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<div className="flew-row flex gap-x-2">
									<Button
										variant="destructive"
										onClick={() => {
											if (optionType === OPTION_TYPE.POST) {
												deletePost(data.id, {
													onSuccess: () => {
														toast.success("Your post has been deleted.");
														setDeleteDialogOpen(false);
													},
													onError: (error) => {
														toast.error("There was an error while creating your post", {
															description: error.message
														});
													}
												});
											}

											if (onDelete) onDelete(data.id);
										}}
									>
										Yes, delete
									</Button>
									<Button
										onClick={() => {
											setDeleteDialogOpen(false);
										}}
									>
										No, take me back
									</Button>
								</div>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
