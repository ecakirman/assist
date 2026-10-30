import Typography from "@mui/material/Typography";

const refSx = {
	fontFamily: "fontFamilyMono",
	whiteSpace: "nowrap",
	fontSize: 12,
	fontWeight: 400,
	color: "text.disabled",
} as const;

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
