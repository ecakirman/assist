import type { Theme } from "@mui/material/styles";
import { slateDiffSx } from "./diffSx/slateDiffSx";
import { syntaxTokenSx } from "./diffSx/syntaxTokenSx";

export const diffSx = (theme: Theme) => {
	const { text, divider } = theme.palette;
	return {
		pt: 2,
		"--diff-text-color": text.primary,
		"--diff-omit-gutter-line-color": divider,
		...syntaxTokenSx(theme),
		...slateDiffSx(theme),
	};
};
