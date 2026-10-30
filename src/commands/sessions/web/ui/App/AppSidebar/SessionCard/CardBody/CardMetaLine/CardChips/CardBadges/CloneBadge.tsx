import HomeOutlined from "@mui/icons-material/HomeOutlined";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { tokenBadgeSx } from "../../../../../../../designSystem/tokenBadgeSx";

const slateSx = tokenBadgeSx("neutral");

export function CloneBadge({ clone }: { clone: string }) {
	const slate = useTheme().design === "slate";
	return (
		<Tooltip title={`Clone — ${clone}`}>
			{slate ? (
				<Box component="span" sx={slateSx}>
					clone
				</Box>
			) : (
				<HomeOutlined sx={{ fontSize: 13, color: "info.main" }} />
			)}
		</Tooltip>
	);
}
