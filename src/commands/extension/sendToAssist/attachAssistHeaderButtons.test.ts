// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { attachAssistHeaderButtons } from "./attachAssistHeaderButtons";

const HEADERS = `<div class="gh-header-actions"><button>Edit</button></div><div data-component="PH_Actions"></div>`;

function buttons(): HTMLButtonElement[] {
	return Array.from(document.querySelectorAll("[data-assist-send]"));
}

afterEach(() => {
	document.body.innerHTML = "";
	history.replaceState(null, "", "/");
});

describe("attachAssistHeaderButtons", () => {
	it("adds a button once to each header on an issue or pull request", () => {
		history.replaceState(null, "", "/org/repo/pull/3/files");
		document.body.innerHTML = HEADERS;
		attachAssistHeaderButtons();
		attachAssistHeaderButtons();
		expect(buttons()).toHaveLength(2);
		expect(buttons()[0].parentElement?.firstElementChild).toBe(buttons()[0]);
	});

	it("skips other pages", () => {
		history.replaceState(null, "", "/org/repo/pulls");
		document.body.innerHTML = HEADERS;
		attachAssistHeaderButtons();
		expect(buttons()).toHaveLength(0);
	});
});
