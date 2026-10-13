import { Box, Chip, Typography } from "@mui/material";

export function HighLevelQuickChips({
	globs,
	active,
	onSelect,
}: {
	globs: string[];
	active: string;
	onSelect: (glob: string) => void;
}) {
	return (
		<Box
			sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.5 }}
		>
			<Typography
				component="span"
				sx={{ fontSize: 11, color: "text.disabled", mr: 0.25 }}
			>
				Quick
			</Typography>
			{globs.map((glob) => {
				const pressed = glob === active.trim();
				return (
					<Chip
						key={glob}
						label={glob}
						size="small"
						clickable
						aria-pressed={pressed}
						onClick={() => onSelect(glob)}
						sx={{
							height: 20,
							fontFamily: "monospace",
							fontSize: 11,
							border: 1,
							borderColor: pressed ? "warning.main" : "transparent",
							color: pressed ? "text.primary" : "text.secondary",
						}}
					/>
				);
			})}
		</Box>
	);
}
