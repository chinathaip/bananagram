import React from "react";
import { TooltipProvider } from "./tooltip";

// For consistency's sake, this component is a wrapper for the TooltipProvider.
export default function TooltipWrapper({ children }: { children: React.ReactNode }) {
	return <TooltipProvider delayDuration={300}>{children}</TooltipProvider>;
}
