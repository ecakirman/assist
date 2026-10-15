import { describe, expect, it } from "vitest";
import { buildTokenUsageTable } from "./buildTokenUsageTable";

describe("buildTokenUsageTable", () => {
	it("renders one row per slot plus a total", () => {
		const table = buildTokenUsageTable([
			{ input: 10, output: 2000, cacheRead: 50000, cacheWrite: 3000 },
			{ input: 5, output: 1000, cacheRead: 25000, cacheWrite: 1000 },
			{ input: 1, output: 500, cacheRead: 0, cacheWrite: 0 },
		]);
		expect(table).toBe(
			[
				"## Token usage",
				"",
				"| Slot | Input | Output | Cache read | Cache write |",
				"| --- | ---: | ---: | ---: | ---: |",
				"| Reviewer 1 | 10 | 2,000 | 50,000 | 3,000 |",
				"| Reviewer 2 | 5 | 1,000 | 25,000 | 1,000 |",
				"| Synthesis | 1 | 500 | 0 | 0 |",
				"| **Total** | 16 | 3,500 | 75,000 | 4,000 |",
			].join("\n"),
		);
	});

	it("dashes a slot without usage and leaves it out of the total", () => {
		const table = buildTokenUsageTable([
			undefined,
			{ input: 5, output: 100, cacheRead: 20 },
			{ input: 1, output: 10, cacheRead: 2, cacheWrite: 7 },
		]);
		expect(table).toContain("| Reviewer 1 | — | — | — | — |");
		expect(table).toContain("| Reviewer 2 | 5 | 100 | 20 | — |");
		expect(table).toContain("| **Total** | 6 | 110 | 22 | 7 |");
	});

	it("dashes the total when no slot reported", () => {
		const table = buildTokenUsageTable([undefined, undefined, undefined]);
		expect(table).toContain("| **Total** | — | — | — | — |");
	});
});
