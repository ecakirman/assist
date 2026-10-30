import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { tokenBadgeSx } from "../../designSystem/tokenBadgeSx";

const sx = tokenBadgeSx("neutral");

export function NodeBadge({ node }: { node?: string }) {
	if (!node) return null;
	return (
		<Tooltip title={`Running on ${node}`}>
			<Box component="span" sx={sx}>
				{node}
			</Box>
		</Tooltip>
	);
}
