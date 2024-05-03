import { ExtraProps } from "react-markdown";

type CustomBulletListProps = JSX.IntrinsicElements["ul"] & ExtraProps;

export function CustomMarkdownUlComponent(props: CustomBulletListProps) {
	const { node, children, ...rest } = props;

	return (
		<ul {...rest} className="ml-4 list-disc">
			{children}
		</ul>
	);
}
