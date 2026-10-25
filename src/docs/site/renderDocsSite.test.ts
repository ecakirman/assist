import { describe, expect, it } from "vitest";
import type { DocsPage } from "../docsPageSchema";
import { renderDocsSite } from "./renderDocsSite";

function page(
	id: string,
	group: DocsPage["group"],
	order: number,
	sections: DocsPage["sections"] = [{ heading: "Intro", markdown: "Hello" }],
): DocsPage {
	return { id, title: `Title ${id}`, group, order, covers: [], sections };
}

const pages = [
	page("backlog", "Backlog", 0),
	page("dashboard", "Sessions", 1),
	page("install", "Getting started", 0, [
		{
			heading: "Run <it>",
			markdown: "Use `assist sync` and **then** go.",
			screenshots: [
				{ file: "dash.png", alt: 'The "dashboard"', route: "/sessions" },
			],
		},
	]),
	page("nodes", "Sessions", 0),
];

function fileAt(path: string, basePath = "/docs/") {
	return renderDocsSite(pages, basePath).find((file) => file.path === path)
		?.content;
}

describe("renderDocsSite", () => {
	it("writes one index.html per page plus a root index of the first page", () => {
		expect(renderDocsSite(pages, "/").map((file) => file.path)).toEqual([
			"install/index.html",
			"nodes/index.html",
			"dashboard/index.html",
			"backlog/index.html",
			"index.html",
		]);
		expect(fileAt("index.html")).toBe(fileAt("install/index.html"));
	});

	it("groups nav by declared group order, then page order", () => {
		const html = fileAt("backlog/index.html") ?? "";
		const headings = [...html.matchAll(/<nav>.*?<\/nav>/gs)][0][0].match(
			/<h2>[^<]+<\/h2>|href="[^"]+"/g,
		);
		expect(headings).toEqual([
			'href="/docs/"',
			"<h2>Getting started</h2>",
			'href="/docs/install/"',
			"<h2>Sessions</h2>",
			'href="/docs/nodes/"',
			'href="/docs/dashboard/"',
			"<h2>Backlog</h2>",
			'href="/docs/backlog/"',
		]);
		expect(html).toContain(
			'<a href="/docs/backlog/" aria-current="page">Title backlog</a>',
		);
	});

	it("prefixes assets with the base path and renders markdown and screenshots", () => {
		const html = fileAt("install/index.html", "/assist/") ?? "";
		expect(html).toContain('<link rel="stylesheet" href="/assist/styles.css">');
		expect(html).toContain('<h2 id="run-it">Run &lt;it&gt;</h2>');
		expect(html).toContain(
			"<p>Use <code>assist sync</code> and <strong>then</strong> go.</p>",
		);
		expect(html).toContain(
			'<picture><source srcset="/assist/screenshots/dash-dark.png" media="(prefers-color-scheme: dark)"><img src="/assist/screenshots/dash.png" alt="The &quot;dashboard&quot;"',
		);
		expect(html).toContain(
			"<figcaption>The &quot;dashboard&quot;</figcaption>",
		);
	});

	it("renders a screenshot at its placeholder instead of after the text", () => {
		const html =
			renderDocsSite(
				[
					page("placed", "Sessions", 0, [
						{
							heading: "Placed",
							markdown: "Before\n\n{{screenshot:a.png}}\n\nAfter",
							screenshots: [
								{ file: "a.png", alt: "A", route: "/", theme: "dark" },
							],
						},
					]),
				],
				"/",
			)[0].content ?? "";
		expect(html).toMatch(
			/<p>Before<\/p>\s*<figure>.*<\/figure>\s*<p>After<\/p>/s,
		);
		expect(html).not.toContain("{{screenshot");
	});

	it("renders a themed screenshot as a single image", () => {
		const html =
			renderDocsSite(
				[
					page("themed", "Sessions", 0, [
						{
							heading: "Dark",
							markdown: "Text",
							screenshots: [
								{ file: "a.png", alt: "A", route: "/", theme: "dark" },
							],
						},
					]),
				],
				"/",
			)[0].content ?? "";
		expect(html).toContain(
			'<figure><img src="/screenshots/a.png" alt="A" loading="lazy">',
		);
	});

	it("leaves feedback markers out of a built site", () => {
		const html = fileAt("install/index.html") ?? "";
		expect(html).not.toContain("assist-docs-page");
		expect(html).not.toContain("data-docs-heading");
	});

	it("stamps a preview with the page, section heading and source", () => {
		const sourced = {
			...page("install", "Getting started", 0, [
				{ heading: 'Say "hi"', markdown: "Text" },
			]),
			source: "docs/guide/pages/install.json",
		};
		const html = renderDocsSite([sourced], "/", true)[0].content ?? "";
		expect(html).toContain('<meta name="assist-docs-page" content="install">');
		expect(html).toContain(
			'<section data-docs-heading="Say &quot;hi&quot;" data-docs-source="docs/guide/pages/install.json">',
		);
	});
});
