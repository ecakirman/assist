import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const wrapperSx = {
	display: "flex",
	gap: 0.5,
	ml: "auto",
	pl: 0.5,
	flexShrink: 0,
} as const;

const countSx = { fontFamily: "fontFamilyMono", fontSize: 11 } as const;

export function DiffFileTreeLineCounts({
	added,
	removed,
}: {
	added: number;
	removed: number;
}) {
	const slate = useTheme().design === "slate";
	return (
		<Box sx={wrapperSx}>
			{(!slate || added > 0) && (
				<Typography component="span" sx={countSx} color="success.main">
					+{added}
				</Typography>
			)}
			{(!slate || removed > 0) && (
				<Typography component="span" sx={countSx} color="error.main">
					{slate ? "−" : "-"}
					{removed}
				</Typography>
			)}
		</Box>
	);
}
