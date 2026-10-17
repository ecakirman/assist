import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Button, Tooltip } from "@mui/material";
import type { MouseEvent } from "react";

export const compactSegmentSx = { minWidth: 0, px: 0.5, py: 0.25 };

export function BuildSegment({
	tooltip,
	disabled,
	onClick,
	compact = false,
}: {
	tooltip: string;
	disabled: boolean;
	onClick: (event: MouseEvent) => void;
	compact?: boolean;
}) {
	return (
		<Tooltip title={tooltip}>
			<Box component="span" sx={{ display: "flex" }}>
				{compact ? (
					<Button
						aria-label="Build"
						disabled={disabled}
						sx={compactSegmentSx}
						onClick={onClick}
					>
						<PlayArrowIcon fontSize="small" />
					</Button>
				) : (
					<Button
						startIcon={<PlayArrowIcon />}
						disabled={disabled}
						onClick={onClick}
					>
						Build
					</Button>
				)}
			</Box>
		</Tooltip>
	);
}
