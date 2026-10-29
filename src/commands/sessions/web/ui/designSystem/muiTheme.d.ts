// oxlint-disable typescript/consistent-type-definitions -- module augmentation must merge into MUI's interfaces
import type { ActiveTokens, DesignName } from "./DesignTokens";

declare module "@mui/material/styles" {
	interface Theme {
		design: DesignName;
		tokens: ActiveTokens;
	}
	interface ThemeOptions {
		design?: DesignName;
		tokens?: ActiveTokens;
	}
	interface TypographyVariants {
		fontFamilyMono: string;
	}
	interface TypographyVariantsOptions {
		fontFamilyMono?: string;
	}
}

declare module "@mui/material/Button" {
	interface ButtonPropsVariantOverrides {
		tonal: true;
	}
}
