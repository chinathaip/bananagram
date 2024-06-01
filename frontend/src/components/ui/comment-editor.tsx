import { EditorContent, useEditor } from "@tiptap/react";

import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";

import { Skeleton } from "./skeleton";
import { Button } from "./button";
import { Markdown } from "tiptap-markdown";

import { toast } from "sonner";
import { Comment } from "@/gql/graphql";

interface CommentEditorProps {
	currentCommentData?: Comment;
	onSubmit: (newComment: Comment) => void;
}

// TODO: fix the flash of unstyled content when switching back to home from about for example, the editor isn't rendered before the posts
export function CommentEditor({ currentCommentData, onSubmit }: CommentEditorProps) {
	const editor = useEditor({
		editorProps: {
			attributes: {
				class: "min-h-36 max-h-48 rounded-md rounded-br-none rounded-bl-none border-input bg-transparent px-3 py-2 border-b-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto"
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
		content: currentCommentData ? currentCommentData.content : ""
	});

	return editor ? (
		<>
			<EditorContent editor={editor} />
			<Button
				disabled={editor.isEmpty}
				onClick={() => {
					// Probably not gonna happen since this button will be disabled, but anyways..
					if (editor.isEmpty) {
						toast.warning("Your post cannot be created without any content");
						return;
					}

					if (currentCommentData) {
						currentCommentData.content = editor.getText();
						onSubmit(currentCommentData);
					}
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
