import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import type { MouseEvent } from "react";
import { Link } from "react-router";
import { formatItemId } from "../../../../backlog/formatItemId";
import { itemDetailPath } from "../../../../backlog/web/ui/itemDetailPath";
import { tokenBadgeSx } from "../designSystem/tokenBadgeSx";
import { useApiNode } from "../useApiNode";

const chipSx = { height: 18, fontSize: "0.65rem", flexShrink: 0 };

const badgeSx = [
	tokenBadgeSx("primary"),
	{ flexShrink: 0, textDecoration: "none" },
] as const;

const stop = (e: MouseEvent) => e.stopPropagation();

export function BacklogItemChip({
	itemId,
	cwd,
}: {
	itemId: number;
	cwd?: string;
}) {
	const node = useApiNode();
	const slate = useTheme().design === "slate";
	const label = formatItemId(itemId);
	const to = itemDetailPath(itemId, cwd, node);

	if (slate)
		return (
			<Box
				component={Link}
				to={to}
				onMouseDown={stop}
				onClick={stop}
				sx={badgeSx}
			>
				{label}
			</Box>
		);

	return (
		<Chip
			label={label}
			size="small"
			sx={chipSx}
			clickable
			component={Link}
			to={to}
			onMouseDown={stop}
			onClick={stop}
		/>
	);
}
