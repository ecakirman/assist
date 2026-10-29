import { describe, expect, it } from "vitest";
import { formatUncoveredReport } from "./formatUncoveredReport";

const inventory = [
	{ id: "cli:update", description: "Update assist" },
	{ id: "route:/backlog", description: "" },
	{ id: "cli:sessions", description: "Sessions dashboard" },
];

describe("formatUncoveredReport", () => {
	it("groups uncovered items by kind with counts", () => {
		expect(formatUncoveredReport(inventory, new Set(["cli:update"]))).toBe(
			[
				"route (1)\n  route:/backlog",
				"cli (1)\n  cli:sessions — Sessions dashboard",
				"2 of 3 items are documented by no page.",
			].join("\n\n"),
		);
	});

	it("reports when every item is covered", () => {
		expect(
			formatUncoveredReport(
				inventory,
				new Set(inventory.map((item) => item.id)),
			),
		).toBe("All 3 items are documented.");
	});
});
