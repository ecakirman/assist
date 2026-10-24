import { describe, expect, it } from "vitest";
import { screenshotVariants } from "./screenshotVariants";

const base = { file: "sessions.png", alt: "Sessions", route: "/sessions" };

describe("screenshotVariants", () => {
	it("captures an unthemed screenshot in light and dark", () => {
		expect(screenshotVariants(base)).toEqual([
			{ file: "sessions.png", theme: "light" },
			{ file: "sessions-dark.png", theme: "dark" },
		]);
	});

	it("captures a themed screenshot once under its own name", () => {
		expect(screenshotVariants({ ...base, theme: "dark" })).toEqual([
			{ file: "sessions.png", theme: "dark" },
		]);
	});
});
