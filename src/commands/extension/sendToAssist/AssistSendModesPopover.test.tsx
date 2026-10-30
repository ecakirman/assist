// @vitest-environment jsdom
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { assistPopoverContent } from "./assistPopoverContent";

const storage: Record<string, unknown> = {};

beforeEach(() => {
	for (const key of Object.keys(storage)) delete storage[key];
	Object.assign(globalThis, {
		browser: {
			runtime: {
				sendMessage: async () => ({ ok: true, clones: ["assist", "other"] }),
				onMessage: { addListener: () => undefined },
			},
			storage: {
				local: {
					get: async (key: string) => ({ [key]: storage[key] }),
					set: async (items: Record<string, unknown>) => {
						Object.assign(storage, items);
					},
				},
			},
		},
	});
});

afterEach(() => {
	cleanup();
	document.body.innerHTML = "";
	delete (globalThis as { browser?: unknown }).browser;
});

function picker(): HTMLSelectElement {
	return screen.getByLabelText("Repo for assist");
}

describe("link popover", () => {
	it("toasts and sends nothing when no repo is picked", async () => {
		const send = vi.fn();
		const dismiss = vi.fn();
		render(assistPopoverContent("link", { send, dismiss }));
		await screen.findByRole("option", { name: "assist" });
		fireEvent.click(screen.getByRole("button", { name: "Prompt" }));
		expect(send).not.toHaveBeenCalled();
		expect(dismiss).not.toHaveBeenCalled();
		expect(document.querySelector("[data-assist-toast]")?.textContent).toBe(
			"Pick a repo to start the assist session in",
		);
	});

	it("remembers the picked repo and defaults to it", async () => {
		const send = vi.fn();
		render(assistPopoverContent("link", { send, dismiss: vi.fn() }));
		await screen.findByRole("option", { name: "other" });
		fireEvent.change(picker(), { target: { value: "other" } });
		await waitFor(() => expect(storage.lastRepo).toBe("other"));
		cleanup();

		render(assistPopoverContent("link", { send, dismiss: vi.fn() }));
		await waitFor(() => expect(picker().value).toBe("other"));
		fireEvent.click(screen.getByRole("button", { name: "Bug" }));
		expect(send).toHaveBeenCalledWith({
			instructions: undefined,
			mode: "bug",
			repo: "other",
		});
	});

	it("ignores a remembered repo that is no longer cloned", async () => {
		storage.lastRepo = "gone";
		render(assistPopoverContent("link", { send: vi.fn(), dismiss: vi.fn() }));
		await screen.findByRole("option", { name: "assist" });
		expect(picker().value).toBe("");
	});
});
