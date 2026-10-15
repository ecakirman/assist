import { describe, expect, it } from "vitest";
import { rateLimitWindowsMatch } from "./rateLimitWindowsMatch";

describe("rateLimitWindowsMatch", () => {
	it("matches identical readings", () => {
		expect(
			rateLimitWindowsMatch([
				{ pct: 42, timeLabel: "3h 10m" },
				{ pct: 42, timeLabel: "3h 10m" },
			]),
		).toBe(true);
	});

	it("matches across units when the numbers agree", () => {
		expect(
			rateLimitWindowsMatch([
				{ pct: 42.4, timeLabel: "3h 10m" },
				{ pct: 41.6, timeLabel: "3d 10h" },
			]),
		).toBe(true);
	});

	it("does not match when the percentages differ", () => {
		expect(
			rateLimitWindowsMatch([
				{ pct: 42, timeLabel: "3h 10m" },
				{ pct: 61, timeLabel: "3d 10h" },
			]),
		).toBe(false);
	});

	it("does not match when the time numbers differ", () => {
		expect(
			rateLimitWindowsMatch([
				{ pct: 42, timeLabel: "3h 10m" },
				{ pct: 42, timeLabel: "3d 1h" },
			]),
		).toBe(false);
	});

	it("does not match a single window", () => {
		expect(rateLimitWindowsMatch([{ pct: 42, timeLabel: "3h 10m" }])).toBe(
			false,
		);
	});
});
