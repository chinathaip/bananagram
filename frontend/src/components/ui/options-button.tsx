import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react";

// This disables scroll when activated, and there is an issue with
// the content being misaligned since the width of the scrollbar is not accounted for.
// Example: https://streamable.com/ysbe7b
export function OptionsButton() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="ml-auto">
				<button>
					<EllipsisIcon className="h-6 w-6" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Post Options</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<PencilIcon className="mr-2 h-4 w-4" />
						<span>Edit</span>
					</DropdownMenuItem>
					<DropdownMenuItem className="text-red-700">
						<Trash2Icon className="mr-2 h-4 w-4" />
						<span>Delete</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
