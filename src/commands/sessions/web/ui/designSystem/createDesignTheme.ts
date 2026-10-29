import type { PaletteMode } from "@mui/material";
import { createTheme, type Theme } from "@mui/material/styles";
import { classicDesign } from "./classicDesign";
import type { ActiveTokens, DesignName } from "./DesignTokens";
import { slateComponents } from "./slateComponents";
import { slateDesign } from "./slateDesign";
import { typography } from "./createDesignTheme/typography";
import { baseComponents } from "./createDesignTheme/baseComponents";

const designs = { classic: classicDesign, slate: slateDesign };

function activeTokens(design: DesignName, mode: PaletteMode): ActiveTokens {
	const { dark, light, ...shared } = designs[design];
	return { ...shared, ...(mode === "dark" ? dark : light), mode };
}

export function createDesignTheme(
	design: DesignName,
	mode: PaletteMode,
): Theme {
	const tokens = activeTokens(design, mode);
	const { color } = tokens;
	return createTheme({
		design,
		tokens,
		palette: {
			mode,
			background: { default: color.background, paper: color.surface },
			primary: color.primary,
			secondary: color.secondary,
			success: color.success,
			warning: color.warning,
			error: color.error,
			info: color.info,
			text: color.text,
			divider: color.line,
			action: { hover: color.raised, selected: color.selected },
		},
		typography: typography(tokens),
		shape: { borderRadius: tokens.radius.sm },
		spacing: tokens.spacing,
		components: {
			...baseComponents(tokens),
			...(design === "slate" && slateComponents(tokens)),
		},
	});
}
