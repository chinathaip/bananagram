import { ExtraProps } from "react-markdown";

type CustomBulletListProps = JSX.IntrinsicElements["ol"] & ExtraProps;

export function CustomMarkdownOlComponent(props: CustomBulletListProps) {
	const { node, children, ...rest } = props;

	return (
		<ul {...rest} className="ml-4 list-decimal pl-1">
			{children}
		</ul>
	);
}
