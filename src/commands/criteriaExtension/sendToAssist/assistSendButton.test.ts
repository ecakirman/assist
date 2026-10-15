// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { assistSendButton } from "./assistSendButton";

afterEach(() => {
	document.head.innerHTML = "";
	vi.unstubAllGlobals();
});

describe("assistSendButton", () => {
	it("shows the extension's icon beside the label", () => {
		const getURL = vi.fn((path: string) => `moz-extension://id/${path}`);
		vi.stubGlobal("browser", { runtime: { getURL } });
		const button = assistSendButton(() => "", "title");
		expect(button.querySelector("img")?.src).toBe(
			"moz-extension://id/icons/assist-32.png",
		);
		expect(button.textContent).toBe("assist");
	});

	it("injects its stylesheet once", () => {
		assistSendButton(() => "", "title");
		assistSendButton(() => "", "title", "header");
		expect(
			document.head.querySelectorAll("[data-assist-send-style]"),
		).toHaveLength(1);
	});

	it("sizes the header button up", () => {
		expect(assistSendButton(() => "", "title", "header").className).toBe(
			"assist-send assist-send--header",
		);
	});
});
