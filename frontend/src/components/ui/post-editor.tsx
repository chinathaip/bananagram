import { Editor, EditorContent, useEditor } from "@tiptap/react";

import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

import { BoldIcon, ItalicIcon, LinkIcon, ListIcon, ListOrderedIcon, Trash2 } from "lucide-react";
import { Fragment, useState } from "react";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
import { Toggle } from "./toggle";
import { Button } from "./button";
import { useCreatePost } from "@/lib/hooks/data-hooks/use-create-post";
import { Markdown } from "tiptap-markdown";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";

import { Post } from "@/gql/graphql";
import { toast } from "sonner";
import { useCategory } from "@/lib/hooks/data-hooks/use-category";
import { useEditPost } from "@/lib/hooks/data-hooks/use-edit-post";
import { Input } from "./input";
import Image from "next/image";
import { useSignedUrl } from "@/lib/hooks/data-hooks/use-signed-url";
import crypto from "crypto";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

export enum EDITOR_ACTION {
	CREATE,
	EDIT
}

interface PostEditorProps {
	onSuccessCallBack: () => void;
	currentPostData?: Post;
	editorAction: EDITOR_ACTION;
}

// TODO: fix the flash of unstyled content when switching back to home from about for example, the editor isn't rendered before the posts
export function PostEditor({ editorAction, currentPostData, onSuccessCallBack }: PostEditorProps) {
	const { data: categoryData } = useCategory();
	const { mutate: createPost } = useCreatePost();
	const { mutate: editPost } = useEditPost();
	const { mutate: getSignedUrl } = useSignedUrl();
	const [file, setFile] = useState<File | undefined>(undefined);
	const [filePreviewUrl, setFilePreviewUrl] = useState<string | undefined>(currentPostData?.medias[0]?.url);
	const [postCategory, setPostCategory] = useState<string>(currentPostData ? currentPostData.category_name : "");
	const editor = useEditor({
		editorProps: {
			attributes: {
				class: "min-h-16 max-h-48 rounded-md rounded-br-none rounded-bl-none border-input bg-transparent px-3 py-2 border-b-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto"
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
			Link,
			Placeholder.configure({
				placeholder: "What's on your mind?"
			})
		],
		content: currentPostData ? currentPostData.content : ""
	});

	return editor ? (
		<>
			<div className="truncate">
				<EditorContent editor={editor} />
			</div>
			{editorAction === EDITOR_ACTION.CREATE && filePreviewUrl && file && (
				<Image src={filePreviewUrl} alt={file.name} width={200} height={200} />
			)}
			{editorAction === EDITOR_ACTION.EDIT &&
				filePreviewUrl &&
				currentPostData &&
				(
					<div className="flex flex-row">
						<Image
							src={filePreviewUrl}
							alt={`image for post ${currentPostData.id}`}
							width={200}
							height={200}
							priority
						/>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger className="item-start flex">
									<Button className="text-red-700" variant="ghost">
										<Trash2 />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Delete this media from your post</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				)}
			<div className="flex flex-row gap-x-2">
				<Input
					type="file"
					disabled={filePreviewUrl !== undefined}
					accept="image/png,image/jpeg,image/jpg,image/gif"
					onChange={(e) => {
						const file = e.target.files?.[0];
						setFile(file);

						if (filePreviewUrl) {
							URL.revokeObjectURL(filePreviewUrl);
						}

						if (file) {
							const localFileUrl = URL.createObjectURL(file);
							setFilePreviewUrl(localFileUrl);
						} else {
							setFilePreviewUrl(undefined);
						}
					}}
				/>
			</div>
			<div className="flex flex-row gap-x-2">
				<PostEditorToolbar editor={editor} />
				<Select onValueChange={setPostCategory} value={postCategory}>
					<SelectTrigger className="ml-auto w-auto border-none">
						<SelectValue placeholder="Category" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel className="mb-1">Categories</SelectLabel>
							<Separator />
							{categoryData?.categories ? (
								categoryData.categories.map((category) => (
									<SelectItem key={`category_${category.name}`} value={category.name}>
										{category.name}
									</SelectItem>
								))
							) : (
								<SelectItem key="category_general" value="General">
									General
								</SelectItem>
							)}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			<Button
				disabled={editor.isEmpty}
				onClick={() => {
					// Probably not gonna happen since this button will be disabled, but anyways..
					if (editor.isEmpty) {
						toast.warning("Your post cannot be created without any content");
						return;
					}

					if (postCategory === "") {
						toast.warning("Your post is missing a category it belongs to");
						return;
					}

					let fileKey: string | undefined;
					if (file) {
						fileKey = crypto.randomBytes(32).toString("hex");
						getSignedUrl(
							{
								fileKey,
								contentType: file.type,
								contentSize: file.size
							},
							{
								onSuccess: (data) => {
									fetch(data.signedUrl.url, {
										method: "PUT",
										body: file,
										headers: {
											"Content-Type": file.type
										}
									}).catch((error) => {
										toast.error("Error while uploading your image", {
											description: error.mesage
										});
									});
								},
								onError: (error) => {
									toast.error("Your media cannot be uploaded yet", {
										description: error.message
									});
								}
							}
						);
					}

					editorAction === EDITOR_ACTION.CREATE
						? createPost(
								{
									content: editor.storage.markdown.getMarkdown(),
									category_name: postCategory,
									file_key: fileKey
								},
								{
									onSuccess: () => {
										editor.commands.clearContent(true);
										// Maybe add action to go to the post page with -> https://ui.shadcn.com/docs/components/toast#with-action
										toast.success("You have successfully created a post.");
										onSuccessCallBack();
									},
									onError: (error) => {
										// had to check here because the UI freezes when try to check with "editor.isEmpty"
										toast.error("There was an error while creating your post", {
											description: error.message
										});
									}
								}
							)
						: editPost(
								{
									id: currentPostData?.id || 0,
									content: editor.storage.markdown.getMarkdown(),
									category_name: postCategory,
									file_key: fileKey
								},
								{
									onSuccess: () => {
										editor.commands.clearContent(true);
										// TODO: can add a button to direct to the post page
										toast.success("You have successfully edit your post.");
										onSuccessCallBack();
									},
									onError: (error) => {
										toast.error("There was an error while editing your post", {
											description: error.message
										});
									}
								}
							);
				}}
				className="w-full"
			>
				Submit
			</Button>
		</>
	) : (
		<div className="flex h-full flex-col justify-evenly rounded-md border border-input bg-transparent p-1">
			<Skeleton className="h-16 rounded-lg" />
			<Skeleton className="h-8 rounded-lg" />
		</div>
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
		<div className="flex h-12 flex-row items-center gap-1 bg-transparent ">
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
