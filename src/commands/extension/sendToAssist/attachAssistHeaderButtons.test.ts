// @vitest-environment jsdom
import { act, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { prActions } from "../../../shared/prActions";
import { reviewButtonModes } from "../../../shared/reviewButtonModes";
import { reviewOptionFlags } from "../../../shared/reviewOptionFlags";
import { attachAssistHeaderButtons } from "./attachAssistHeaderButtons";

const HEADERS = `<div class="gh-header-actions"><button>Edit</button></div><div data-component="PH_Actions"></div>`;

const PANE = `<div class="pane-actions"><div role="group" aria-label="Side panel controls"></div><button>Close panel</button></div>`;

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

	it("adds a button to a project side pane and sends the canonical item URL", async () => {
		const sendMessage = vi.fn().mockResolvedValue({ ok: true, message: "ok" });
		vi.stubGlobal("browser", { runtime: { sendMessage } });
		history.replaceState(
			null,
			"",
			"/orgs/acme/projects/6/views/1?pane=issue&issue=acme%7Crepo%7C497",
		);
		document.body.innerHTML = PANE;
		attachAssistHeaderButtons();
		expect(buttons()).toHaveLength(1);
		expect(buttons()[0].parentElement?.className).toBe("pane-actions");
		await act(async () => buttons()[0].click());
		const textarea = popover()?.querySelector("textarea");
		expect(textarea).not.toBeNull();
	});

	it("resolves a pull request in a project pane from its item link", async () => {
		history.replaceState(
			null,
			"",
			"/orgs/acme/projects/6/views/1?pane=issue&issue=acme%7Crepo%7C12",
		);
		document.body.innerHTML = `${PANE}<a href="https://github.com/acme/repo/pull/12">#12</a>`;
		attachAssistHeaderButtons();
		await act(async () => buttons()[0].click());
		expect(menuItems().length).toBeGreaterThan(0);
	});

	it("removes the button when the pane no longer shows an item", () => {
		history.replaceState(
			null,
			"",
			"/orgs/acme/projects/6/views/1?pane=issue&issue=acme%7Crepo%7C497",
		);
		document.body.innerHTML = PANE;
		attachAssistHeaderButtons();
		history.replaceState(null, "", "/orgs/acme/projects/6/views/1");
		attachAssistHeaderButtons();
		expect(buttons()).toHaveLength(0);
	});

	it("opens a focused menu of review modes and PR actions on a pull request", async () => {
		await openOn("/org/repo/pull/3/files");
		expect(menuItems().map((item) => item.textContent)).toEqual(
			[...reviewButtonModes, ...prActions].map(({ label }) => label),
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

	it("appends checked toggle flags to the picked mode", async () => {
		const sendMessage = vi.fn().mockResolvedValue({ ok: true, message: "ok" });
		vi.stubGlobal("browser", { runtime: { sendMessage } });
		await openOn("/org/repo/pull/3");
		const toggles = Array.from(
			popover()?.querySelectorAll<HTMLElement>('[role="menuitemcheckbox"]') ??
				[],
		);
		expect(toggles.map((item) => item.textContent)).toEqual(
			reviewOptionFlags.map(({ label }) => label),
		);
		await act(async () => toggles[2].click());
		expect(toggles[2].getAttribute("aria-checked")).toBe("true");
		await act(async () => menuItems()[0].click());
		expect(sendMessage).toHaveBeenCalledWith(
			expect.objectContaining({ args: ["review", "--announce"] }),
		);
	});

	it("sends a PR action's args", async () => {
		const sendMessage = vi.fn().mockResolvedValue({ ok: true, message: "ok" });
		vi.stubGlobal("browser", { runtime: { sendMessage } });
		await openOn("/org/repo/pull/3");
		const item = menuItems().find((el) => el.textContent === "Checkout");
		await act(async () => item?.click());
		expect(sendMessage).toHaveBeenCalledWith(
			expect.objectContaining({ args: ["review", "--checkout-only"] }),
		);
	});

	it("moves focus with the arrow keys", async () => {
		await openOn("/org/repo/pull/3");
		await act(async () =>
			fireEvent.keyDown(menuItems()[0], { key: "ArrowDown" }),
		);
		expect(popover()?.activeElement).toBe(menuItems()[1]);
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
