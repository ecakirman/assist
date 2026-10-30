// @vitest-environment jsdom
import { act, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { attachGmailMessageButtons } from "./attachGmailMessageButtons";

const THREAD = `<div role="main"><div class="ha"><h2 class="hP">Change request</h2></div><div class="adn" data-message-id="#msg-f:1" data-legacy-message-id="a1"><span class="g3">Mon</span></div><div class="kv"><span class="g3">Tue</span></div><div class="adn" data-message-id="#msg-f:2" data-legacy-message-id="a2"><span class="g3">Wed</span></div></div>`;

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

describe("attachGmailMessageButtons", () => {
	it("puts an assist button before each expanded message's date", () => {
		document.body.innerHTML = THREAD;
		attachGmailMessageButtons();
		attachGmailMessageButtons();
		expect(
			buttons().map((button) => button.nextElementSibling?.textContent),
		).toEqual(["Mon", "Wed"]);
	});

	it("sends the permalink of the message whose button was pressed", async () => {
		const sendMessage = vi
			.fn()
			.mockResolvedValueOnce({ ok: true, clones: ["repo"] })
			.mockResolvedValue({ ok: true, message: "started" });
		vi.stubGlobal("browser", { runtime: { sendMessage } });
		const pageFetch = vi.fn().mockResolvedValue({
			ok: true,
			text: async () => "Message-ID: <first@example.com>\r\n\r\nbody",
		});
		vi.stubGlobal("fetch", pageFetch);
		document.body.innerHTML = THREAD;
		attachGmailMessageButtons();
		await act(async () => buttons()[0].click());
		const select = popover()?.querySelector("select") as HTMLSelectElement;
		await vi.waitFor(() => expect(select.options).toHaveLength(2));
		await act(async () =>
			fireEvent.change(select, { target: { value: "repo" } }),
		);
		const prompt = Array.from(popover()?.querySelectorAll("button") ?? []).find(
			(button) => button.textContent === "Prompt",
		);
		await act(async () => prompt?.click());
		await vi.waitFor(() =>
			expect(sendMessage).toHaveBeenLastCalledWith(
				expect.objectContaining({
					url: "https://mail.google.com/mail/u/0/#search/rfc822msgid%3A%3Cfirst%40example.com%3E",
					repo: "repo",
				}),
			),
		);
		expect(pageFetch.mock.calls[0][0]).toContain("permmsgid=msg-f%3A1");
	});

	it("leaves pages without an open message alone", () => {
		document.body.innerHTML = '<div role="main"></div>';
		attachGmailMessageButtons();
		expect(buttons()).toHaveLength(0);
	});

	it("opens the send popover with a repo picker", async () => {
		vi.stubGlobal("browser", {
			runtime: {
				sendMessage: vi.fn().mockResolvedValue({ ok: true, clones: ["repo"] }),
			},
		});
		document.body.innerHTML = THREAD;
		attachGmailMessageButtons();
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
