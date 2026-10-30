import { Box } from "@mui/material";
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
	return (
		<Box style={style} sx={itemDetailLayout.containerSx}>
			<Box sx={itemDetailLayout.columnsSx}>
				<Box sx={itemDetailLayout.mainColumnSx}>
					{header}
					{body}
				</Box>
				{navigator}
			</Box>
		</Box>
	);
}
