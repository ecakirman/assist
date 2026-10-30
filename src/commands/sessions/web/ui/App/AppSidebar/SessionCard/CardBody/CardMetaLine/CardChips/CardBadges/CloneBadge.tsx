import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { tokenBadgeSx } from "../../../../../../../designSystem/tokenBadgeSx";

const sx = tokenBadgeSx("neutral");

export function CloneBadge({ clone }: { clone: string }) {
	return (
		<Tooltip title={`Clone — ${clone}`}>
			<Box component="span" sx={sx}>
				clone
			</Box>
		</Tooltip>
	);
}
