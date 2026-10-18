import { Box } from "@mui/material";
import type { MouseEvent, Ref } from "react";
import { BuildSegment } from "./BuildSegment";
import { MoreActionsSegment } from "./MoreActionsSegment";

export function CompactPlayButtonGroup({
	anchorRef,
	tooltip,
	disabled,
	onBuild,
	onMore,
}: {
	anchorRef: Ref<HTMLButtonElement>;
	tooltip: string;
	disabled: boolean;
	onBuild: (event: MouseEvent) => void;
	onMore: (event: MouseEvent) => void;
}) {
	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
			<BuildSegment
				compact
				tooltip={tooltip}
				disabled={disabled}
				onClick={onBuild}
			/>
			<MoreActionsSegment anchorRef={anchorRef} onClick={onMore} />
		</Box>
	);
}
