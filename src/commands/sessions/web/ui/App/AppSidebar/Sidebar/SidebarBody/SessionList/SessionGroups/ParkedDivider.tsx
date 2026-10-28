import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const dividerSx = {
	display: "flex",
	alignItems: "center",
	gap: 1,
	px: "10px",
	pt: 2,
	pb: 0.5,
} as const;

const labelSx = {
	color: "text.disabled",
	textTransform: "uppercase",
	letterSpacing: "0.08em",
	fontSize: "0.7rem",
} as const;

const ruleSx = { flex: 1, height: "1px", bgcolor: "divider" } as const;

export function ParkedDivider() {
	return (
		<Box sx={dividerSx} data-testid="parked-divider">
			<Typography variant="caption" sx={labelSx}>
				Parked
			</Typography>
			<Box sx={ruleSx} />
		</Box>
	);
}
