import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import type { Theme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { useSearchParams } from "react-router";
import { ChordTooltipTitle } from "../../ChordTooltipTitle";
import { useShortcut } from "../../useShortcut";

const filledSx = {
	bgcolor: "primary.main",
	color: "primary.contrastText",
	transition: "filter 0.2s ease, transform 0.2s ease",
	"&:hover": { bgcolor: "primary.main", filter: "brightness(1.08)" },
	"&:active": { transform: "translateY(1px)" },
} as const;

const sx = (t: Theme) => ({
	ml: 0.75,
	...(t.tokens.color.appBar && filledSx),
});

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
