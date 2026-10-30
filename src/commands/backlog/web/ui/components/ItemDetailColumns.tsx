import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { CSSProperties, ReactNode } from "react";
import { itemDetailLayout } from "./itemDetailLayout";

export function ItemDetailColumns({
	style,
	header,
	body,
	navigator,
}: {
	style: CSSProperties;
	header: ReactNode;
	body: ReactNode;
	navigator: ReactNode;
}) {
	const slate = useTheme().design === "slate";
	if (slate)
		return (
			<Box style={style} sx={itemDetailLayout.containerSx}>
				<Box sx={itemDetailLayout.slateColumnsSx}>
					<Box sx={itemDetailLayout.mainColumnSx}>
						{header}
						{body}
					</Box>
					{navigator}
				</Box>
			</Box>
		);
	return (
		<Box style={style}>
			{header}
			<Box sx={itemDetailLayout.containerSx}>
				<Box sx={itemDetailLayout.columnsSx}>
					{body}
					{navigator}
				</Box>
			</Box>
		</Box>
	);
}
