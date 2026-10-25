// @vitest-environment jsdom
import { act, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { attachAssistButtons } from "./attachAssistButtons";

const PERMALINK = "https://github.com/org/repo/pull/1#discussion_r2";

function buttons(): HTMLButtonElement[] {
	return Array.from(document.querySelectorAll("[data-assist-send]"));
}

function popoverField(): HTMLTextAreaElement | null | undefined {
	return document
		.querySelector("[data-assist-popover]")
		?.shadowRoot?.querySelector("textarea[aria-label]");
}

async function openPopover(
	button = buttons()[0],
): Promise<HTMLTextAreaElement> {
	await act(async () => button.click());
	const field = popoverField();
	if (!field) throw new Error("popover did not open");
	return field;
}

function stubSend(result = { ok: true, message: "started" }) {
	const sendMessage = vi.fn().mockResolvedValue(result);
	vi.stubGlobal("browser", { runtime: { sendMessage } });
	return sendMessage;
}

afterEach(async () => {
	const field = popoverField();
	if (field) await act(async () => fireEvent.keyDown(field, { key: "Escape" }));
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

	it("adds a canonical-url button to React comment headers in a project pane", async () => {
		const sendMessage = stubSend();
		const permalink = "https://github.com/org/repo/issues/497#issuecomment-5";
		globalThis.history.replaceState(
			null,
			"",
			"/orgs/org/projects/6/views/1?pane=issue&issue=org%7Crepo%7C497",
		);
		document.body.innerHTML = `<div role="dialog"><div id="issuecomment-5" data-testid="comment-header"><h3 class="sr-only">me commented <relative-time></relative-time></h3><span><a href="${permalink}" data-turbo="true"><relative-time></relative-time></a></span></div></div>`;
		attachAssistButtons();
		expect(buttons()).toHaveLength(1);
		const field = await openPopover();
		await act(async () => fireEvent.keyDown(field, { key: "Enter" }));
		expect(sendMessage).toHaveBeenCalledWith(
			expect.objectContaining({ url: permalink }),
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

	it("opens a focused instructions popover instead of sending", async () => {
		const sendMessage = stubSend();
		document.body.innerHTML = `<a href="${PERMALINK}"><relative-time></relative-time></a>`;
		attachAssistButtons();
		const field = await openPopover();
		expect((field.getRootNode() as ShadowRoot).activeElement).toBe(field);
		expect(sendMessage).not.toHaveBeenCalled();
	});

	it("sends on Enter with an empty field and toasts the result", async () => {
		const sendMessage = stubSend({
			ok: false,
			message: "org/repo is not cloned",
		});
		document.body.innerHTML = `<a href="${PERMALINK}"><relative-time></relative-time></a>`;
		attachAssistButtons();
		const field = await openPopover();
		await act(async () => fireEvent.keyDown(field, { key: "Enter" }));
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
		expect(popoverField()).toBeFalsy();
	});

	it("sends typed instructions", async () => {
		const sendMessage = stubSend();
		document.body.innerHTML = `<a href="${PERMALINK}"><relative-time></relative-time></a>`;
		attachAssistButtons();
		const field = await openPopover();
		await act(async () => {
			fireEvent.change(field, { target: { value: "fix it" } });
			fireEvent.keyDown(field, { key: "Enter" });
		});
		expect(sendMessage).toHaveBeenCalledWith(
			expect.objectContaining({ instructions: "fix it" }),
		);
	});

	it("closes on Escape without sending", async () => {
		const sendMessage = stubSend();
		document.body.innerHTML = `<a href="${PERMALINK}"><relative-time></relative-time></a>`;
		attachAssistButtons();
		const field = await openPopover();
		await act(async () => fireEvent.keyDown(field, { key: "Escape" }));
		expect(popoverField()).toBeFalsy();
		expect(document.activeElement).toBe(buttons()[0]);
		expect(sendMessage).not.toHaveBeenCalled();
	});

	it("closes when focus leaves the field", async () => {
		document.body.innerHTML = `<a href="${PERMALINK}"><relative-time></relative-time></a>`;
		attachAssistButtons();
		const field = await openPopover();
		await act(async () => fireEvent.blur(field));
		expect(popoverField()).toBeFalsy();
	});

	it("toggles closed when its button is clicked again", async () => {
		document.body.innerHTML = `<a href="${PERMALINK}"><relative-time></relative-time></a>`;
		attachAssistButtons();
		await openPopover();
		await act(async () => buttons()[0].click());
		expect(popoverField()).toBeFalsy();
	});
});
