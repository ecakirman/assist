import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { docsPaths } from "../docsPaths";
import { docsSectionsPlugin } from "./docsSectionsPlugin";

type Node = {
	type: string;
	tagName?: string;
	value?: string;
	properties?: Record<string, unknown>;
	children?: Node[];
};

const text = (value: string): Node => ({ type: "text", value });
const element = (
	tagName: string,
	children: Node[],
	properties: Record<string, unknown> = {},
): Node => ({ type: "element", tagName, properties, children });
const h2 = (heading: string) => element("h2", [text(heading)]);
const wrapped = (heading: string) =>
	element("div", [h2(heading), element("a", [text("Section titled")])], {
		className: ["sl-heading-wrapper", "level-h2"],
	});

function textContent(node: Node): string {
	return node.value ?? (node.children ?? []).map(textContent).join("");
}

function run(children: Node[], path = join(docsPaths.pagesDir, "page.md")) {
	const plugin = docsSectionsPlugin()({ fileURL: pathToFileURL(path) });
	const replaceNode = vi.fn();
	plugin?.after({ type: "root", children }, { textContent, replaceNode });
	return replaceNode.mock.calls[0]?.[1].children as Node[] | undefined;
}

describe("docsSectionsPlugin", () => {
	it("skips markdown outside the docs pages", () => {
		expect(
			docsSectionsPlugin()({ fileURL: pathToFileURL("/elsewhere/page.md") }),
		).toBeUndefined();
	});

	it("wraps each h2 and its content in a stamped section", () => {
		const intro = element("p", [text("Intro")]);
		const body = element("p", [text("Body")]);
		const [first, second, third] =
			run([intro, h2("One"), body, h2("Two")]) ?? [];
		expect(first).toBe(intro);
		expect(second).toMatchObject({
			tagName: "section",
			properties: {
				"data-docs-heading": "One",
				"data-docs-source": join("docs/src/content/docs", "page.md"),
			},
		});
		expect(second.children).toHaveLength(2);
		expect(second.children?.[1]).toBe(body);
		expect(third.properties?.["data-docs-heading"]).toBe("Two");
	});

	it("takes the heading from inside Starlight's anchor wrapper", () => {
		const [section] = run([wrapped("Anchored")]) ?? [];
		expect(section.properties?.["data-docs-heading"]).toBe("Anchored");
	});
});
