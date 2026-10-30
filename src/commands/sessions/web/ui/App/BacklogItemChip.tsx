import Box from "@mui/material/Box";
import type { MouseEvent } from "react";
import { Link } from "react-router";
import { formatItemId } from "../../../../backlog/formatItemId";
import { itemDetailPath } from "../../../../backlog/web/ui/itemDetailPath";
import { tokenBadgeSx } from "../designSystem/tokenBadgeSx";
import { useApiNode } from "../useApiNode";

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
	return (
		<Box
			component={Link}
			to={itemDetailPath(itemId, cwd, node)}
			onMouseDown={stop}
			onClick={stop}
			sx={badgeSx}
		>
			{formatItemId(itemId)}
		</Box>
	);
}
