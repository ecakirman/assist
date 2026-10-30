import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const HELP_URL = "https://staffordwilliams.com/assist";

const sx = { color: "inherit", mr: 0.5 } as const;

export function HelpButton() {
	return (
		<Tooltip title="Help">
			<IconButton
				component="a"
				href={HELP_URL}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Help"
				sx={sx}
			>
				<HelpOutlineIcon />
			</IconButton>
		</Tooltip>
	);
}
