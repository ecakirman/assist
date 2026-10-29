// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { inspectPage, MAX_INSPECT_MATCHES } from "./inspectPage";

describe("inspectPage", () => {
	beforeEach(() => {
		document.body.className = "page";
		document.body.innerHTML = `
			<div id="header" class="bolt-header flex-row">
				<button class="bolt-button primary">  Publish
				</button>
			</div>
			<script>const label = "Publish";</script>`;
	});

	it("gives each selector match its ancestor chain, text and size", () => {
		expect(inspectPage(document, { selector: "button" })).toEqual({
			total: 1,
			matches: [
				{
					chain: [
						"html",
						"body.page",
						"div#header.bolt-header.flex-row",
						"button.bolt-button.primary",
					],
					text: "Publish",
					width: 0,
					height: 0,
				},
			],
		});
	});

	it("matches the element holding the text, skipping scripts", () => {
		const { matches, total } = inspectPage(document, { text: "Publish" });
		expect(total).toBe(1);
		expect(matches[0].chain.at(-1)).toBe("button.bolt-button.primary");
	});

	it("reports no matches", () => {
		expect(inspectPage(document, { text: "Approve" })).toEqual({
			matches: [],
			total: 0,
		});
	});

	it("caps the matches but counts them all", () => {
		document.body.innerHTML = "<span>x</span>".repeat(MAX_INSPECT_MATCHES + 5);
		const { matches, total } = inspectPage(document, { selector: "span" });
		expect(matches).toHaveLength(MAX_INSPECT_MATCHES);
		expect(total).toBe(MAX_INSPECT_MATCHES + 5);
	});

	it("truncates long text", () => {
		document.body.innerHTML = `<p>${"a".repeat(200)}</p>`;
		const [match] = inspectPage(document, { selector: "p" }).matches;
		expect(match.text).toBe(`${"a".repeat(80)}…`);
	});

	it("throws on an invalid selector", () => {
		expect(() => inspectPage(document, { selector: "[" })).toThrow();
	});
});
