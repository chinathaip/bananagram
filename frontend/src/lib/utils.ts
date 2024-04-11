import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatTimestamp(date: Date) {
	// Format the date part
	const optionsDate: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "short",
		year: "numeric"
	};

	const formattedDate = date.toLocaleDateString("en-GB", optionsDate);

	// Format the time part
	const optionsTime: Intl.DateTimeFormatOptions = {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
		timeZoneName: "short"
	};

	const formattedTime = date.toLocaleTimeString("en-GB", optionsTime);

	return `${formattedDate} ${formattedTime}`;
}
