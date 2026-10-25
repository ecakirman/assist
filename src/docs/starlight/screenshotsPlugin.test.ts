import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { docsPaths } from "../docsPaths";
import { screenshotsPlugin } from "./screenshotsPlugin";

const screenshots = [
	{ file: "a.png", alt: "A", route: "/a" },
	{ file: "b.png", alt: "B", route: "/b" },
];

function pluginFor(path: string) {
	return screenshotsPlugin("/")({
		fileURL: pathToFileURL(path),
		data: { astro: { frontmatter: { screenshots } } },
	});
}

const pagePath = join(docsPaths.pagesDir, "page.md");

function directive(file: string, name = "screenshot") {
	return { name, attributes: { file } };
}

describe("screenshotsPlugin", () => {
	it("skips markdown outside the docs pages", () => {
		expect(pluginFor("/elsewhere/page.md")).toBeUndefined();
	});

	it("replaces each ::screenshot directive with its figure", () => {
		const plugin = pluginFor(pagePath);
		const replaceNode = vi.fn();
		for (const file of ["a.png", "b.png"])
			plugin?.leafDirective(directive(file), { replaceNode });
		plugin?.leafDirective(directive("a.png", "other"), { replaceNode });
		expect(replaceNode).toHaveBeenCalledTimes(2);
		expect(replaceNode.mock.calls[0][1].value).toContain(
			'src="/screenshots/a.png"',
		);
		expect(() => plugin?.after()).not.toThrow();
	});

	it("fails on a directive for an undeclared screenshot", () => {
		const plugin = pluginFor(pagePath);
		expect(() =>
			plugin?.leafDirective(directive("c.png"), { replaceNode: vi.fn() }),
		).toThrow(/undeclared file "c\.png"/);
	});

	it("fails when a declared screenshot is never placed", () => {
		const plugin = pluginFor(pagePath);
		plugin?.leafDirective(directive("a.png"), { replaceNode: vi.fn() });
		expect(() => plugin?.after()).toThrow(/b\.png$/);
	});
});
