import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { writeJobSummary } from "./writeJobSummary";

const prInfo = { prNumber: 1, baseSha: "base", headSha: "head" };

const synthesis = `# Code review synthesis

## Summary

The change is small and safe.

## Findings
`;

describe("writeJobSummary", () => {
	const dir = mkdtempSync(join(tmpdir(), "job-summary-"));
	const synthesisPath = join(dir, "synthesis.md");
	writeFileSync(synthesisPath, synthesis);

	it("appends the review summary to the job summary file", () => {
		vi.spyOn(console, "log").mockImplementation(() => {});
		const summaryPath = join(dir, "summary.md");
		writeFileSync(summaryPath, "earlier step\n");

		writeJobSummary(synthesisPath, prInfo, summaryPath, [
			{
				name: "claude",
				outputPath: "claude.md",
				exitCode: 0,
				stderr: "",
				usage: { input: 3, output: 40, cacheRead: 500, cacheWrite: 60 },
			},
			{ name: "codex", outputPath: "codex.md", exitCode: 0, stderr: "" },
			{ name: "synthesis", outputPath: "s.md", exitCode: 0, stderr: "" },
		]);

		const written = readFileSync(summaryPath, "utf8");
		expect(written.startsWith("earlier step\n## Code review summary")).toBe(
			true,
		);
		expect(written).toContain("The change is small and safe.");
		expect(written).toContain("## Token usage");
		expect(written).toContain("| Reviewer 1 | 3 | 40 | 500 | 60 |");
		expect(written).toContain("| Reviewer 2 | — | — | — | — |");
	});

	it("does nothing outside a workflow", () => {
		expect(() =>
			writeJobSummary(join(dir, "missing.md"), prInfo, undefined, []),
		).not.toThrow();
	});
});
