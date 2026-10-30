import { Box, Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Ref } from "react";
import { BackButton } from "./BackButton";
import { HeaderActions, type HeaderContentProps } from "./HeaderActions";
import { ItemMeta } from "./ItemMeta";
import { SlateHeaderContent } from "./SlateHeaderContent";
import { useStuckSentinel } from "./useStuckSentinel";

const headerSx = {
	justifyContent: "space-between",
	alignItems: "center",
	mb: 2,
} as const;

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
		borderBottom: theme.design === "slate" ? 0 : 1,
		borderColor: "divider",
		boxShadow: stuck ? stuckShadow(theme) : "none",
		transition: theme.transitions.create("box-shadow"),
	});
}

type PinnedHeaderProps = HeaderContentProps & { ref: Ref<HTMLDivElement> };

function ClassicHeaderContent({
	item,
	onDeleted,
	onStatusChange,
}: HeaderContentProps) {
	return (
		<>
			<Stack direction="row" sx={headerSx}>
				<BackButton to="/backlog" />
				<HeaderActions item={item} onDeleted={onDeleted} />
			</Stack>
			<Typography variant="h5" component="h2">
				{item.name}
			</Typography>
			<ItemMeta item={item} onStatusChange={onStatusChange} />
		</>
	);
}

export function PinnedHeader({ ref, ...props }: PinnedHeaderProps) {
	const { sentinelRef, stuck } = useStuckSentinel();
	const slate = useTheme().design === "slate";
	return (
		<>
			<Box ref={sentinelRef} sx={{ height: 0 }} />
			<Box ref={ref} sx={pinnedSx(stuck)}>
				{slate ? (
					<SlateHeaderContent {...props} />
				) : (
					<ClassicHeaderContent {...props} />
				)}
			</Box>
		</>
	);
}
