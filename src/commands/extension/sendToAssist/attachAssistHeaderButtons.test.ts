// @vitest-environment jsdom
import { act, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { reviewButtonModes } from "../../../shared/reviewButtonModes";
import { attachAssistHeaderButtons } from "./attachAssistHeaderButtons";

const HEADERS = `<div class="gh-header-actions"><button>Edit</button></div><div data-component="PH_Actions"></div>`;

function buttons(): HTMLButtonElement[] {
	return Array.from(document.querySelectorAll("[data-assist-send]"));
}

function popover(): ShadowRoot | null | undefined {
	return document.querySelector("[data-assist-popover]")?.shadowRoot;
}

function menuItems(): HTMLElement[] {
	return Array.from(popover()?.querySelectorAll('[role="menuitem"]') ?? []);
}

async function openOn(path: string): Promise<void> {
	history.replaceState(null, "", path);
	document.body.innerHTML = HEADERS;
	attachAssistHeaderButtons();
	await act(async () => buttons()[0].click());
}

afterEach(async () => {
	const open = popover()?.querySelector("textarea, [role=menu]");
	if (open) await act(async () => fireEvent.keyDown(open, { key: "Escape" }));
	document.body.innerHTML = "";
	history.replaceState(null, "", "/");
	vi.unstubAllGlobals();
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

	it("opens a focused review mode menu on a pull request", async () => {
		await openOn("/org/repo/pull/3/files");
		expect(menuItems().map((item) => item.textContent)).toEqual(
			reviewButtonModes.map((mode) => mode.label),
		);
		expect(popover()?.activeElement).toBe(menuItems()[0]);
		expect(popover()?.querySelector("textarea")).toBeNull();
	});

	it("sends the picked mode's args for the pull request", async () => {
		const sendMessage = vi.fn().mockResolvedValue({ ok: true, message: "ok" });
		vi.stubGlobal("browser", { runtime: { sendMessage } });
		await openOn("/org/repo/pull/3");
		const [, refine] = reviewButtonModes;
		const item = menuItems().find((el) => el.textContent === refine.label);
		await act(async () => item?.click());
		expect(sendMessage).toHaveBeenCalledWith({
			type: "assist-send",
			url: `${location.origin}/org/repo/pull/3`,
			args: refine.args,
		});
		expect(popover()).toBeFalsy();
	});

	it("closes the menu on Escape", async () => {
		await openOn("/org/repo/pull/3");
		await act(async () => fireEvent.keyDown(menuItems()[0], { key: "Escape" }));
		expect(popover()).toBeFalsy();
		expect(document.activeElement).toBe(buttons()[0]);
	});

	it("keeps the instructions popover on an issue", async () => {
		await openOn("/org/repo/issues/7");
		expect(popover()?.querySelector("textarea[aria-label]")).not.toBeNull();
		expect(menuItems()).toHaveLength(0);
	});
});
