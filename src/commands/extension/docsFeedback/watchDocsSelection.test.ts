// @vitest-environment jsdom
import { act, fireEvent } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { watchDocsSelection } from "./watchDocsSelection";

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

function select(id: string): HTMLElement {
	const element = document.getElementById(id) as HTMLElement;
	const range = document.createRange();
	range.setStart(element.firstChild as Text, 0);
	range.setEnd(element.firstChild as Text, 7);
	const selection = globalThis.getSelection() as Selection;
	selection.removeAllRanges();
	selection.addRange(range);
	return element;
}

function popover(): Element | null {
	return document.querySelector("[data-assist-popover]");
}

beforeAll(() => {
	Range.prototype.getClientRects = () => [] as unknown as DOMRectList;
	Range.prototype.getBoundingClientRect = () => new DOMRect(10, 20, 30, 40);
	watchDocsSelection();
});

afterEach(() => {
	act(() => {
		fireEvent.keyDown(
			popover()?.shadowRoot?.querySelector("textarea") ?? document.body,
			{ key: "Escape" },
		);
	});
	globalThis.getSelection()?.removeAllRanges();
	document.head.innerHTML = "";
	document.body.innerHTML = "";
});

describe("watchDocsSelection", () => {
	it("opens the popover at the selection end on a mouse selection", async () => {
		render();
		await act(async () => {
			fireEvent.mouseUp(select("text"));
		});
		expect(popover()?.shadowRoot?.activeElement?.tagName).toBe("TEXTAREA");
		const anchor = document.querySelector<HTMLElement>(
			"[data-assist-docs-feedback]",
		);
		expect(anchor?.style.top).toBe("60px");
		expect(anchor?.style.left).toBe("40px");
	});

	it("keeps the selected text highlighted until the popover closes", async () => {
		const highlights = new Map<string, unknown>();
		vi.stubGlobal("CSS", { highlights });
		vi.stubGlobal(
			"Highlight",
			class {
				constructor(readonly range: Range) {}
			},
		);
		render();
		await act(async () => {
			fireEvent.mouseUp(select("text"));
		});
		expect(highlights.has("assist-docs-feedback")).toBe(true);
		act(() => {
			fireEvent.keyDown(
				popover()?.shadowRoot?.querySelector("textarea") as Element,
				{ key: "Escape" },
			);
		});
		expect(highlights.size).toBe(0);
		vi.unstubAllGlobals();
	});

	it("keeps a popover with typed feedback when the text is reselected", async () => {
		render();
		await act(async () => {
			fireEvent.mouseUp(select("text"));
		});
		const textarea = popover()?.shadowRoot?.querySelector(
			"textarea",
		) as HTMLTextAreaElement;
		act(() => {
			fireEvent.change(textarea, { target: { value: "Pin the version" } });
			fireEvent.blur(textarea);
		});
		await act(async () => {
			fireEvent.mouseUp(select("text"));
		});
		expect(document.querySelectorAll("[data-assist-popover]")).toHaveLength(1);
		expect(popover()?.shadowRoot?.querySelector("textarea")).toBe(textarea);
		expect(textarea.value).toBe("Pin the version");
	});

	it("ignores a keyboard selection", () => {
		render();
		fireEvent.keyUp(select("text"), { key: "ArrowRight", shiftKey: true });
		expect(popover()).toBeNull();
	});

	it("ignores a selection outside a docs section", () => {
		render();
		fireEvent.mouseUp(select("outside"));
		expect(popover()).toBeNull();
	});

	it("ignores pages that are not a docs preview", () => {
		render(false);
		fireEvent.mouseUp(select("text"));
		expect(popover()).toBeNull();
	});
});
