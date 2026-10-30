import { describe, expect, it } from "vitest";
import { createDesignTheme } from "./createDesignTheme";
import { slateDesign } from "./slateDesign";

describe("createDesignTheme", () => {
	it.each(["dark", "light"] as const)(
		"builds the %s palette and type from the Slate tokens",
		(mode) => {
			const theme = createDesignTheme(mode);
			const { color } = slateDesign[mode];
			expect(theme.palette.mode).toBe(mode);
			expect(theme.palette.background.default).toBe(color.background);
			expect(theme.palette.background.paper).toBe(color.surface);
			expect(theme.palette.primary.main).toBe(color.primary.main);
			expect(theme.palette.divider).toBe(color.line);
			expect(theme.typography.fontFamily).toBe(slateDesign.font.ui);
			expect(theme.typography.fontFamilyMono).toBe(slateDesign.font.mono);
			expect(theme.shape.borderRadius).toBe(slateDesign.radius.sm);
		},
	);

	it("carries the active tokens on the theme", () => {
		const theme = createDesignTheme("dark");
		expect(theme.palette.background.default).toBe(
			theme.tokens.color.background,
		);
		expect(theme.typography.button.textTransform).toBe("none");
		expect(theme.components?.MuiAppBar?.defaultProps?.elevation).toBe(0);
	});
});
