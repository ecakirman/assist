import { ButtonGroup } from "@mui/material";
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
	anchorRef: Ref<HTMLDivElement>;
	tooltip: string;
	disabled: boolean;
	onBuild: (event: MouseEvent) => void;
	onMore: (event: MouseEvent) => void;
}) {
	return (
		<ButtonGroup
			ref={anchorRef}
			variant="contained"
			color="success"
			size="small"
		>
			<BuildSegment
				compact
				tooltip={tooltip}
				disabled={disabled}
				onClick={onBuild}
			/>
			<MoreActionsSegment disabled={disabled} onClick={onMore} />
		</ButtonGroup>
	);
}
