// @vitest-environment jsdom
import { act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { attachGmailHeaderButton } from "./attachGmailHeaderButton";

const THREAD = `<div role="main"><div class="ha"><h2 class="hP">Change request</h2></div><div class="adn" data-message-id="#msg-f:1" data-legacy-message-id="a1"></div><div class="adn" data-message-id="#msg-f:2" data-legacy-message-id="a2"></div></div>`;

function buttons(): HTMLButtonElement[] {
	return Array.from(document.querySelectorAll("[data-assist-send]"));
}

function popover(): ShadowRoot | null | undefined {
	return document.querySelector("[data-assist-popover]")?.shadowRoot;
}

afterEach(() => {
	document.querySelector("[data-assist-popover]")?.remove();
	document.body.innerHTML = "";
	vi.unstubAllGlobals();
});

describe("attachGmailHeaderButton", () => {
	it("puts the assist button after the open thread's subject", () => {
		document.body.innerHTML = THREAD;
		attachGmailHeaderButton();
		attachGmailHeaderButton();
		expect(buttons()).toHaveLength(1);
		expect(document.querySelector("h2.hP")?.nextElementSibling).toBe(
			buttons()[0],
		);
	});

	it("leaves pages without an open message alone", () => {
		document.body.innerHTML = '<div role="main"></div>';
		attachGmailHeaderButton();
		expect(buttons()).toHaveLength(0);
	});

	it("opens the send popover with a repo picker", async () => {
		vi.stubGlobal("browser", {
			runtime: {
				sendMessage: vi.fn().mockResolvedValue({ ok: true, clones: ["repo"] }),
			},
		});
		document.body.innerHTML = THREAD;
		attachGmailHeaderButton();
		await act(async () => buttons()[0].click());
		const labels = Array.from(popover()?.querySelectorAll("button") ?? []).map(
			(button) => button.textContent,
		);
		expect(labels).toEqual(["Prompt", "Draft", "Bug"]);
		expect(
			Array.from(popover()?.querySelectorAll("option") ?? []).map(
				(option) => option.value,
			),
		).toEqual(["", "repo"]);
	});
});
