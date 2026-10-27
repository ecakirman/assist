import { describe, expect, it } from "vitest";
import { newsFeedXml } from "./newsFeedXml";

describe("newsFeedXml", () => {
	const now = Date.parse("2026-10-27T12:00:00Z");

	it("dates each item hoursAgo before now and links it under the feed", () => {
		const xml = newsFeedXml(
			{
				name: "tooling",
				title: "Tooling Weekly",
				items: [{ title: "Faster builds, today", hoursAgo: 6 }],
			},
			now,
		);
		expect(xml).toContain("<title>Tooling Weekly</title>");
		expect(xml).toContain(
			"<link>https://example.com/tooling/faster-builds-today</link>",
		);
		expect(xml).toContain("<pubDate>Tue, 27 Oct 2026 06:00:00 GMT</pubDate>");
		expect(xml).not.toContain("<description>");
	});

	it("escapes markup in titles and excerpts", () => {
		const xml = newsFeedXml(
			{
				name: "frontend",
				title: "A & B",
				items: [{ title: "<dialog>", hoursAgo: 0, excerpt: "x < y" }],
			},
			now,
		);
		expect(xml).toContain("<title>A &amp; B</title>");
		expect(xml).toContain("<title>&lt;dialog&gt;</title>");
		expect(xml).toContain("<description>x &lt; y</description>");
	});
});
