import Markdown from "react-markdown";
import { CustomMarkdownAComponent } from "./custom-md-a-component";

export default function MarkdownViewer({ children }: { children: string }) {
	return (
		<Markdown
			className="text-sm"
			components={{
				a: CustomMarkdownAComponent
			}}
		>
			{children}
		</Markdown>
	);
}
