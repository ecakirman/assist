import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { Ref } from "react";
import type { HeaderContentProps } from "./HeaderActions";
import { SlateHeaderContent } from "./SlateHeaderContent";
import { useStuckSentinel } from "./useStuckSentinel";

function stuckShadow(theme: Theme) {
	return theme.palette.mode === "dark"
		? "0 8px 8px -9px rgba(0, 0, 0, 0.8)"
		: "0 6px 6px -7px rgba(0, 0, 0, 0.2)";
}

function pinnedSx(stuck: boolean): SxProps<Theme> {
	return (theme) => ({
		position: "sticky",
		top: 0,
		zIndex: 1,
		bgcolor: "background.default",
		mx: -2,
		px: 2,
		pb: 2,
		boxShadow: stuck ? stuckShadow(theme) : "none",
		transition: theme.transitions.create("box-shadow"),
	});
}

type PinnedHeaderProps = HeaderContentProps & { ref: Ref<HTMLDivElement> };

export function PinnedHeader({ ref, ...props }: PinnedHeaderProps) {
	const { sentinelRef, stuck } = useStuckSentinel();
	return (
		<>
			<Box ref={sentinelRef} sx={{ height: 0 }} />
			<Box ref={ref} sx={pinnedSx(stuck)}>
				<SlateHeaderContent {...props} />
			</Box>
		</>
	);
}
