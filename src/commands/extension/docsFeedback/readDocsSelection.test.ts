// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { readDocsSelection } from "./readDocsSelection";

const PAGE = `
<section data-docs-heading="Install" data-docs-source="docs/guide/pages/start.json">
	<h2>Install</h2><p id="text">Run npm install to begin.</p>
</section>
<p id="outside">Not in a section</p>`;

function render(meta = true) {
	document.head.innerHTML = meta
		? '<meta name="assist-docs-page" content="start">'
		: "";
	document.body.innerHTML = PAGE;
}

function select(id: string, start: number, end: number): Selection {
	const text = document.getElementById(id)?.firstChild as Text;
	const range = document.createRange();
	range.setStart(text, start);
	range.setEnd(text, end);
	const selection = globalThis.getSelection() as Selection;
	selection.removeAllRanges();
	selection.addRange(range);
	return selection;
}

afterEach(() => {
	document.head.innerHTML = "";
	document.body.innerHTML = "";
});

describe("readDocsSelection", () => {
	it("reads the page, section and selected text", () => {
		render();
		expect(readDocsSelection(document, select("text", 4, 15))).toMatchObject({
			pageId: "start",
			heading: "Install",
			source: "docs/guide/pages/start.json",
			selection: "npm install",
		});
	});

	it("ignores pages that are not a docs preview", () => {
		render(false);
		expect(readDocsSelection(document, select("text", 4, 15))).toBeUndefined();
	});

	it("ignores a collapsed or blank selection", () => {
		render();
		expect(readDocsSelection(document, select("text", 4, 4))).toBeUndefined();
		expect(readDocsSelection(document, select("text", 3, 4))).toBeUndefined();
	});

	it("ignores text outside a docs section", () => {
		render();
		expect(
			readDocsSelection(document, select("outside", 0, 3)),
		).toBeUndefined();
	});
});
