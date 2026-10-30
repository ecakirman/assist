import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";

type BackButtonProps = {
	to: string;
};

const classicSx = { mb: 2, textTransform: "none" } as const;

const slateSx = {
	justifySelf: "start",
	minHeight: 0,
	minWidth: 0,
	p: 0,
	fontSize: 12,
	fontWeight: 400,
	lineHeight: 1.5,
	"&:hover": { bgcolor: "transparent" },
} as const;

export function BackButton({ to }: BackButtonProps) {
	const navigate = useNavigate();
	const slate = useTheme().design === "slate";
	return (
		<Button
			data-backlog-focus="back"
			variant="text"
			size="small"
			onClick={() => navigate(to)}
			sx={slate ? slateSx : classicSx}
		>
			&larr; {slate ? "Backlog" : "Back"}
		</Button>
	);
}
