import { Editor, EditorContent, useEditor } from "@tiptap/react";

import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";

import { BoldIcon,  ItalicIcon, ListIcon, ListOrderedIcon, SquarePen, StrikethroughIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
import { Toggle } from "./toggle";
import { Button } from "./button";
import { useCreatePost } from "@/lib/hooks/data-hooks/use-create-post";
import { Markdown } from "tiptap-markdown";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";
import { useToast } from "./use-toast";
import { Dialog, DialogContent, DialogTrigger,  DialogHeader } from "./dialog";
import { useSession } from "@clerk/nextjs";

// TODO: fix the flash of unstyled content when switching back to home from about for example, the editor isn't rendered before the posts
export function PostEditor({ requestRefetch }: { requestRefetch: () => void }) {
	const [open, setOpen] = useState<boolean>(false);
	const { isSignedIn } = useSession();
	const { mutate: createPost } = useCreatePost();
	const [postCategory, setPostCategory] = useState<string>("");
	const { toast } = useToast();
	const editor = useEditor({
		editorProps: {
			attributes: {
				class: "min-h-36 max-h-48  rounded-md rounded-br-none rounded-bl-none border-input bg-transparent px-3 py-2 border-b-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto"
			}
		},
		extensions: [
			Markdown,
			StarterKit.configure({
				orderedList: {
					HTMLAttributes: {
						class: "list-decimal pl-4"
					}
				},
				bulletList: {
					HTMLAttributes: {
						class: "list-disc pl-4"
					}
				}
			}),

			Placeholder.configure({
				placeholder: "What's on your mind?"
			})
		],
		content: ""
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="w-full py-10" variant="outline" disabled={!isSignedIn}>
					<div className="item-center flex w-full flex-row gap-x-4 text-left text-lg">
						<SquarePen />
						What&apos;s on your mind&#63; {!isSignedIn && "Please sign in to post..."}
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>Create new post</DialogHeader>
				<Separator />

				{editor ? (
					<>
						<EditorContent editor={editor} />
						<div className="flex flex-row gap-x-2">
							<PostEditorToolbar editor={editor} />
							<Select onValueChange={setPostCategory} value={postCategory}>
								<SelectTrigger className="ml-auto w-auto border-none">
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Categories</SelectLabel>
										{/* TODO: get from backend */}
										<SelectItem value="1">General</SelectItem>
										<SelectItem value="2">Technology</SelectItem>
										<SelectItem value="3">Entertainment</SelectItem>
										<SelectItem value="4">Education</SelectItem>
										<SelectItem value="5">Movies</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>

						<Button
							disabled={editor.isEmpty}
							onClick={() => {
								createPost(
									{
										content: editor.storage.markdown.getMarkdown(),
										category_id: parseInt(postCategory)
									},
									{
										onSuccess: () => {
											editor.commands.clearContent(true);
											toast({
												// Maybe add action to go to the post page with -> https://ui.shadcn.com/docs/components/toast#with-action
												title: "You have successfully created a post"
											});
											requestRefetch();
											setOpen(false);
										},
										onError: (error, variables, _) => {
											// had to check here because the UI freezes when try to check with "editor.isEmpty"
											if (variables.content === "") {
												toast({
													variant: "destructive",
													title: "Your post cannot be created with no content"
												});
												return;
											}

											toast({
												variant: "destructive",
												title: "There was an error while creating your post",
												description: error.message
											});
										}
									}
								);
							}}
							className="mt-2 w-full"
						>
							Post
						</Button>
					</>
				) : (
					<div className="flex h-full flex-col justify-evenly rounded-md border border-input bg-transparent p-1">
						<Skeleton className="h-16 rounded-lg" />
						<Skeleton className="h-8 rounded-lg" />
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
const toolbarCategories = [
	{
		category: "Text Formatting",
		items: [
			{
				command: "bold",
				Icon: BoldIcon,
				tooltip: "Toggle Bold",
				func: (editor: Editor) => {
					editor.chain().focus().toggleBold().run();
				}
			},
			{
				command: "italic",
				Icon: ItalicIcon,
				tooltip: "Toggle Italic",
				func: (editor: Editor) => {
					editor.chain().focus().toggleItalic().run();
				}
			},
			{
				command: "strike",
				Icon: StrikethroughIcon,
				tooltip: "Toggle Strikethrough",
				func: (editor: Editor) => {
					editor.chain().focus().toggleStrike().run();
				}
			}
		]
	},
	{
		category: "List Operations",
		items: [
			{
				command: "bulletList",
				Icon: ListIcon,
				tooltip: "Toggle Bullet List",
				func: (editor: Editor) => {
					editor.chain().focus().toggleBulletList().run();
				}
			},
			{
				command: "orderedList",
				Icon: ListOrderedIcon,
				tooltip: "Toggle Ordered List",
				func: (editor: Editor) => {
					editor.chain().focus().toggleOrderedList().run();
				}
			}
		]
	}
];

function PostEditorToolbar({ editor }: { editor: Editor }) {
	return (
		<div className="flex h-12 flex-row items-center gap-1 bg-transparent p-1">
			{/* TODO: uh... let's try this again later. */}
			{toolbarCategories.map((category, index) => (
				<Fragment key={"toolbarcategoryitem_" + category.category}>
					{category.items.map(({ command, Icon, tooltip, func }) => (
						<Toggle
							key={"toolbaritem_" + command}
							size="sm"
							pressed={editor.isActive(command)}
							onPressedChange={() => func(editor)}
							aria-label={tooltip}
						>
							<Icon className="h-4 w-4" />
						</Toggle>
					))}

					{index < toolbarCategories.length - 1 && <Separator orientation="vertical" className="h-8" />}
				</Fragment>
			))}
		</div>
	);
}
