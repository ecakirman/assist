// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { attachAssistButtons } from "./attachAssistButtons";

const PERMALINK = "https://github.com/org/repo/pull/1#discussion_r2";

function buttons(): HTMLButtonElement[] {
	return Array.from(document.querySelectorAll("[data-assist-send]"));
}

afterEach(() => {
	document.body.innerHTML = "";
	vi.unstubAllGlobals();
});

describe("attachAssistButtons", () => {
	it("adds a button beside each comment timestamp", () => {
		document.body.innerHTML = `<a href="${PERMALINK}"><relative-time></relative-time></a><a class="js-timestamp" href="https://github.com/org/repo/pull/1#issuecomment-3">x</a>`;
		attachAssistButtons();
		expect(buttons()).toHaveLength(2);
		expect(buttons()[0].previousElementSibling?.getAttribute("href")).toBe(
			PERMALINK,
		);
	});

	it("ignores comment links in markdown bodies", () => {
		document.body.innerHTML = `<p><a href="${PERMALINK}">see here</a></p>`;
		attachAssistButtons();
		expect(buttons()).toHaveLength(0);
	});

	it("attaches once per timestamp", () => {
		document.body.innerHTML = `<a href="${PERMALINK}"><relative-time></relative-time></a>`;
		attachAssistButtons();
		attachAssistButtons();
		expect(buttons()).toHaveLength(1);
	});

	it("sends the permalink and toasts the result", async () => {
		const sendMessage = vi
			.fn()
			.mockResolvedValue({ ok: false, message: "org/repo is not cloned" });
		vi.stubGlobal("browser", { runtime: { sendMessage } });
		document.body.innerHTML = `<a href="${PERMALINK}"><relative-time></relative-time></a>`;
		attachAssistButtons();
		buttons()[0].click();
		await vi.waitFor(() =>
			expect(document.querySelector("[data-assist-toast]")?.textContent).toBe(
				"org/repo is not cloned",
			),
		);
		expect(sendMessage).toHaveBeenCalledWith({
			type: "assist-send",
			url: PERMALINK,
			instructions: undefined,
		});
	});
});
