import { describe, expect, it } from "vitest";
import type { DocsPage } from "./docsPageSchema";
import { findUnknownScenes } from "./findUnknownScenes";

const page: DocsPage = {
	id: "sessions",
	title: "Sessions",
	group: "Sessions",
	order: 0,
	covers: [],
	sections: [
		{
			heading: "Layout",
			markdown: "text",
			screenshots: [
				{ file: "a.png", alt: "a", route: "/sessions", scene: "dashboard" },
				{ file: "b.png", alt: "b", route: "/sessions", scene: "missing" },
				{ file: "c.png", alt: "c", route: "/sessions" },
			],
		},
	],
};

describe("findUnknownScenes", () => {
	it("names screenshots whose scene is not declared", () => {
		expect(findUnknownScenes([page], { dashboard: [{ run: "dev" }] })).toEqual([
			"sessions: b.png (missing)",
		]);
	});
});
