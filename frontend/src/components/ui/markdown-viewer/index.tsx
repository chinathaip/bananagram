import Markdown from "react-markdown";
import { CustomMarkdownAComponent } from "./custom-md-a-component";
import { CustomMarkdownUlComponent } from "./custom-md-ul-component";
import { CustomMarkdownOlComponent } from "./custom-md-ol-component";

export default function MarkdownViewer({ children }: { children: string }) {
	return (
		<Markdown
			className="text-sm"
			components={{
				a: CustomMarkdownAComponent,
				ul: CustomMarkdownUlComponent,
				ol: CustomMarkdownOlComponent
			}}
		>
			{children}
		</Markdown>
	);
}
