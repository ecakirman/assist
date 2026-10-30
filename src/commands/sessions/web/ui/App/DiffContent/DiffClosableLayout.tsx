import Box from "@mui/material/Box";
import type { HTMLAttributes, ReactNode } from "react";
import { DiffCloseFooter } from "./DiffCloseFooter";

export type DiffScrollRegionProps = HTMLAttributes<HTMLDivElement> &
	Record<`data-${string}`, string>;

const scrollRegionSx = {
	flex: 1,
	minHeight: 0,
	overflow: "auto",
	"&:focus": { outline: "none" },
} as const;

export function DiffClosableLayout({
	onClose,
	scrollRegionProps,
	children,
}: {
	onClose?: () => void;
	scrollRegionProps?: DiffScrollRegionProps;
	children: ReactNode;
}) {
	if (!onClose) return children;

	return (
		<>
			<Box {...scrollRegionProps} sx={scrollRegionSx}>
				{children}
			</Box>
			<DiffCloseFooter onClose={onClose} />
		</>
	);
}
