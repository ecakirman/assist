import type { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const refSx = (t: Theme) => ({
	fontFamily: "fontFamilyMono",
	color: "text.secondary",
	whiteSpace: "nowrap",
	...(t.design === "slate" && {
		fontSize: 12,
		fontWeight: 400,
		color: "text.disabled",
	}),
});

export function NextRepoRef({
	repo,
	number,
}: {
	repo: string;
	number: number;
}) {
	return (
		<Typography variant="body2" sx={refSx}>
			{repo}#{number}
		</Typography>
	);
}
