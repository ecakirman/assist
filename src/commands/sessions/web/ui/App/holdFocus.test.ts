// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { holdFocus, isFocusHeld } from "./holdFocus";

afterEach(() => {
	document.body.innerHTML = "";
});

function addElement(html: string): HTMLElement {
	const wrapper = document.createElement("div");
	wrapper.innerHTML = html;
	document.body.append(wrapper);
	return wrapper.firstElementChild as HTMLElement;
}

describe("isFocusHeld", () => {
	it("is false when nothing holds focus", () => {
		expect(isFocusHeld()).toBe(false);
	});

	it("is true while the held element has focus", () => {
		const card = addElement('<div tabindex="0"></div>');
		holdFocus(card);
		expect(isFocusHeld()).toBe(true);
		card.blur();
		expect(isFocusHeld()).toBe(false);
	});

	it("is true while a modal dialog is open", () => {
		addElement('<div role="dialog" aria-modal="true"></div>');
		expect(isFocusHeld()).toBe(true);
	});

	it("ignores non-modal dialogs", () => {
		addElement('<div role="dialog"></div>');
		expect(isFocusHeld()).toBe(false);
	});
});
