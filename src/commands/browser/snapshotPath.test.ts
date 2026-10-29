import { homedir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { snapshotPath } from "./snapshotPath";

describe("snapshotPath", () => {
	it("names the file after the tab's host and the time", () => {
		expect(
			snapshotPath(
				"http://localhost:4321/docs/",
				new Date("2026-10-29T08:10:56.145Z"),
			),
		).toBe(
			join(
				homedir(),
				".assist",
				"browser",
				"localhost-4321-2026-10-29T08-10-56-145Z.html",
			),
		);
	});
});
