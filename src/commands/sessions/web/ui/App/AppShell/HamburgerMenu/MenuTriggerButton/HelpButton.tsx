import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const HELP_URL = "https://staffordwilliams.com/assist";

export function HelpButton() {
	return (
		<Tooltip title="Help">
			<IconButton
				component="a"
				href={HELP_URL}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Help"
				size="small"
				sx={{ color: "inherit" }}
			>
				<HelpOutlineIcon fontSize="small" />
			</IconButton>
		</Tooltip>
	);
}
