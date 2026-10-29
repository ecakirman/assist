import Typography from "@mui/material/Typography";

export function NextRepoRef({
	repo,
	number,
}: {
	repo: string;
	number: number;
}) {
	return (
		<Typography
			variant="body2"
			sx={{
				fontFamily: "fontFamilyMono",
				color: "text.secondary",
				whiteSpace: "nowrap",
			}}
		>
			{repo}#{number}
		</Typography>
	);
}
