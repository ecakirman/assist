import Box from "@mui/material/Box";
import { slateTreeGlyphSx } from "../../slateTreeSx";

export function DiffTreeFileGlyph() {
	return (
		<Box component="span" sx={slateTreeGlyphSx}>
			◇
		</Box>
	);
}
