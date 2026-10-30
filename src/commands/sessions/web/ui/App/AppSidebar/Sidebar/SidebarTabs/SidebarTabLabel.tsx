import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

const countSx = {
	ml: 0.5,
	fontFamily: "fontFamilyMono",
	fontSize: 11,
	fontWeight: 400,
	color: "text.disabled",
} as const;

export function SidebarTabLabel({
	label,
	count,
}: {
	label: string;
	count: number;
}) {
	if (useTheme().design !== "slate") return `${label} ${count}`;
	return (
		<>
			{label}
			<Box component="span" sx={countSx}>
				{count}
			</Box>
		</>
	);
}
