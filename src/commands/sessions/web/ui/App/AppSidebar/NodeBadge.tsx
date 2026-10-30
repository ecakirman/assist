import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { tokenBadgeSx } from "../../designSystem/tokenBadgeSx";

const chipSx = { height: 16, fontSize: "0.65rem" };

const slateSx = tokenBadgeSx("neutral");

export function NodeBadge({ node }: { node?: string }) {
	const slate = useTheme().design === "slate";
	if (!node) return null;
	return (
		<Tooltip title={`Running on ${node}`}>
			{slate ? (
				<Box component="span" sx={slateSx}>
					{node}
				</Box>
			) : (
				<Chip
					label={node}
					size="small"
					color="info"
					variant="outlined"
					sx={chipSx}
				/>
			)}
		</Tooltip>
	);
}
