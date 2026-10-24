import { describe, expect, it } from "vitest";
import { formatPendingReport } from "./formatPendingReport";

const inventory = [
	{ id: "cli:update", description: "Update assist" },
	{ id: "route:/backlog", description: "" },
	{ id: "cli:sessions", description: "Sessions dashboard" },
];

describe("formatPendingReport", () => {
	it("groups pending items by area in area order with counts", () => {
		expect(
			formatPendingReport(inventory, {
				backlog: ["route:/backlog"],
				"sessions-core": ["cli:sessions"],
			}),
		).toBe(
			[
				"sessions-core (1)\n  cli:sessions — Sessions dashboard",
				"backlog (1)\n  route:/backlog",
				"2 of 3 items pending user documentation.",
			].join("\n\n"),
		);
	});

	it("reports when nothing is pending", () => {
		expect(formatPendingReport(inventory, { backlog: [] })).toBe(
			"No items pending user documentation.",
		);
	});
});
