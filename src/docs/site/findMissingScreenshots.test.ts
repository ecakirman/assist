import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DocsPage } from "../docsPageSchema";
import { findMissingScreenshots } from "./findMissingScreenshots";

let dir: string;

beforeEach(() => {
	dir = mkdtempSync(join(tmpdir(), "docs-shots-"));
});

afterEach(() => {
	rmSync(dir, { recursive: true, force: true });
});

describe("findMissingScreenshots", () => {
	it("lists screenshot variants whose png is not on disk", () => {
		for (const file of ["present.png", "present-dark.png", "light.png"])
			writeFileSync(join(dir, file), "");
		const page: DocsPage = {
			id: "sessions",
			title: "Sessions",
			group: "Sessions",
			order: 0,
			covers: [],
			sections: [
				{
					heading: "Layout",
					markdown: "Text",
					screenshots: [
						{ file: "present.png", alt: "a", route: "/sessions" },
						{ file: "absent.png", alt: "b", route: "/sessions" },
						{ file: "light.png", alt: "c", route: "/sessions", theme: "light" },
					],
				},
				{ heading: "Text only", markdown: "Text" },
			],
		};
		expect(findMissingScreenshots([page], dir)).toEqual([
			"sessions: absent.png",
			"sessions: absent-dark.png",
		]);
	});
});
