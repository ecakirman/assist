import { createTheme } from "@mui/material/styles";
import { describe, expect, it } from "vitest";
import { createDesignTheme } from "./createDesignTheme";

const previousTheme = (mode: "dark" | "light") =>
	createTheme({
		palette: {
			mode,
			...(mode === "dark" && {
				background: { default: "#1e1e1e", paper: "#252526" },
			}),
		},
	});

function dataOf(value: object): unknown {
	const withoutFunctions = JSON.stringify(value);
	return JSON.parse(withoutFunctions);
}

describe("createDesignTheme", () => {
	it.each(["dark", "light"] as const)(
		"reproduces the previous %s palette, type and shape under classic",
		(mode) => {
			const classic = createDesignTheme("classic", mode);
			const previous = previousTheme(mode);
			expect(dataOf(classic.palette)).toEqual(dataOf(previous.palette));
			expect(dataOf(classic.typography)).toEqual(dataOf(previous.typography));
			expect(classic.shape).toEqual(previous.shape);
			expect(classic.spacing(2)).toBe(previous.spacing(2));
		},
	);

	it("carries the active design and tokens on the theme", () => {
		const theme = createDesignTheme("slate", "dark");
		expect(theme.design).toBe("slate");
		expect(theme.palette.background.default).toBe(
			theme.tokens.color.background,
		);
		expect(theme.typography.button.textTransform).toBe("none");
		expect(theme.components?.MuiAppBar?.defaultProps?.elevation).toBe(0);
	});
});
