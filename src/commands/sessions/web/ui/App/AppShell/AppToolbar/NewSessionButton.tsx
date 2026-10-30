import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useSearchParams } from "react-router";
import { ChordTooltipTitle } from "../../ChordTooltipTitle";
import { useShortcut } from "../../useShortcut";

const sx = {
	ml: 0.75,
	bgcolor: "primary.main",
	color: "primary.contrastText",
	transition: "filter 0.2s ease, transform 0.2s ease",
	"& .MuiSvgIcon-root": { fontSize: 18 },
	"&:hover": { bgcolor: "primary.main", filter: "brightness(1.08)" },
	"&:active": { transform: "translateY(1px)" },
} as const;

export function NewSessionButton() {
	const [, setSearchParams] = useSearchParams();
	const { label, chords } = useShortcut("newSession");

	const open = () =>
		setSearchParams(
			(params) => {
				params.set("new", "");
				return params;
			},
			{ replace: true },
		);

	return (
		<Tooltip title={<ChordTooltipTitle label={label} chords={chords} />}>
			<IconButton sx={sx} aria-label="New session" onClick={open}>
				<AddIcon />
			</IconButton>
		</Tooltip>
	);
}
