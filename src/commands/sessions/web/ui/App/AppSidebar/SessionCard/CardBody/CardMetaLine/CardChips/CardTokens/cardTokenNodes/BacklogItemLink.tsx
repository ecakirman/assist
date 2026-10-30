import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router";
import { formatItemId } from "../../../../../../../../../../../backlog/formatItemId";
import { itemDetailPath } from "../../../../../../../../../../../backlog/web/ui/itemDetailPath";
import { tokenBadgeSx } from "../../../../../../../../designSystem/tokenBadgeSx";
import { useApiNode } from "../../../../../../../../useApiNode";

const classicSx = {
	color: "primary.main",
	opacity: 0.85,
	whiteSpace: "nowrap",
} as const;

const slateSx = tokenBadgeSx("primary");

export function BacklogItemLink({
	itemId,
	cwd,
}: {
	itemId: number;
	cwd?: string;
}) {
	const node = useApiNode();
	const slate = useTheme().design === "slate";
	return (
		<Link
			component={RouterLink}
			to={itemDetailPath(itemId, cwd, node)}
			underline="hover"
			sx={slate ? slateSx : classicSx}
			onMouseDown={(e) => e.stopPropagation()}
			onClick={(e) => e.stopPropagation()}
		>
			{formatItemId(itemId)}
		</Link>
	);
}
