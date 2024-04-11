import { ExtraProps } from "react-markdown";

// Type for props expected by our custom <a> component
type CustomLinkProps = JSX.IntrinsicElements["a"] & ExtraProps;

// Define the custom component
export function CustomMarkdownAComponent(props: CustomLinkProps) {
	// Destructure with default values for props that might not be provided
	const { node, children, ...rest } = props;

	// Now 'rest' contains all <a> specific props like 'href', 'title', etc.
	// and you can use 'node' for any special handling based on the AST
	return (
		<a {...rest} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
			{children}
		</a>
	);
}
