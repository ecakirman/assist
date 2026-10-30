// @vitest-environment jsdom
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { renderWithTheme } from "../../../../../test/renderWithTheme";
import { slateDesign } from "./slateDesign";

const styleOf = (label: string) => getComputedStyle(screen.getByText(label));

describe("slate control overrides", () => {
	afterEach(cleanup);

	it("sizes icon buttons as 30px squares", () => {
		renderWithTheme(<IconButton aria-label="refresh">r</IconButton>, {
			mode: "dark",
		});
		const style = getComputedStyle(screen.getByLabelText("refresh"));
		expect(style.width).toBe("30px");
		expect(style.borderRadius).toBe(`${slateDesign.radius.sm}px`);
	});

	it("renders text buttons as muted ghosts at 13px", () => {
		renderWithTheme(<Button>Back</Button>, { mode: "dark" });
		expect(styleOf("Back").fontSize).toBe("13px");
		expect(styleOf("Back").color).toBe("rgb(138, 147, 163)");
	});

	it("gives filled chips the 20px tinted style", () => {
		renderWithTheme(<Chip color="info" label="story" />, { mode: "dark" });
		const chip = screen.getByText("story").parentElement as HTMLElement;
		expect(getComputedStyle(chip).height).toBe("20px");
		expect(getComputedStyle(chip).backgroundColor).toBe(
			"rgba(108, 182, 255, 0.14)",
		);
	});
});
