import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { FileTypeIcon } from "../../../../../FileTypeIcon";
import { slateTreeGlyphSx } from "../../slateTreeSx";

export function DiffTreeFileGlyph({ path }: { path: string }) {
	if (useTheme().design !== "slate") return <FileTypeIcon path={path} />;
	return (
		<Box component="span" sx={slateTreeGlyphSx}>
			◇
		</Box>
	);
}
