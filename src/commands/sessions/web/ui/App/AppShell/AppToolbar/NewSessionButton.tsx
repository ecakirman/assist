import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { useSearchParams } from "react-router";
import { ChordTooltipTitle } from "../../ChordTooltipTitle";
import { useShortcut } from "../../useShortcut";

const classicSx = { color: "success.light" } as const;

const slateSx = {
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
	const slate = useTheme().design === "slate";

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
			<IconButton
				size={slate ? "medium" : "small"}
				sx={slate ? slateSx : classicSx}
				aria-label="New session"
				onClick={open}
			>
				{slate ? <AddIcon /> : <AddCircleIcon />}
			</IconButton>
		</Tooltip>
	);
}
