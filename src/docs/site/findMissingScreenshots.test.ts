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
	it("lists screenshots whose png is not on disk", () => {
		writeFileSync(join(dir, "present.png"), "");
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
					],
				},
				{ heading: "Text only", markdown: "Text" },
			],
		};
		expect(findMissingScreenshots([page], dir)).toEqual([
			"sessions: absent.png",
		]);
	});
});
