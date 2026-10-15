// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { assistOptions } from "./assistOptions";

let stored: Record<string, unknown>;

function render(): { input: HTMLInputElement; status: HTMLElement } {
	document.body.innerHTML = `<form><input name="serverUrl" /><button type="submit">Save</button><span data-status></span></form>`;
	return {
		input: document.querySelector("input") as HTMLInputElement,
		status: document.querySelector("[data-status]") as HTMLElement,
	};
}

async function submit(input: HTMLInputElement, value: string): Promise<void> {
	input.value = value;
	input.form?.requestSubmit();
	await vi.waitFor(() =>
		expect(document.querySelector("[data-status]")?.textContent).not.toBe(""),
	);
}

beforeEach(() => {
	stored = {};
	vi.stubGlobal("browser", {
		storage: {
			local: {
				get: async (key: string) => ({ [key]: stored[key] }),
				set: async (items: Record<string, unknown>) => {
					Object.assign(stored, items);
				},
			},
		},
	});
});

afterEach(() => vi.unstubAllGlobals());

describe("assistOptions", () => {
	it("defaults the field to http://localhost:3100", async () => {
		const { input } = render();
		await assistOptions();
		expect(input.value).toBe("http://localhost:3100");
	});

	it("shows the stored URL", async () => {
		stored.serverUrl = "http://localhost:3200";
		const { input } = render();
		await assistOptions();
		expect(input.value).toBe("http://localhost:3200");
	});

	it("saves the URL's origin", async () => {
		const { input, status } = render();
		await assistOptions();
		await submit(input, " http://localhost:4000/ ");
		expect(stored.serverUrl).toBe("http://localhost:4000");
		expect(input.value).toBe("http://localhost:4000");
		expect(status.textContent).toBe("Saved");
	});

	it("rejects a non-http URL", async () => {
		const { input, status } = render();
		await assistOptions();
		await submit(input, "ftp://example.com");
		expect(stored.serverUrl).toBeUndefined();
		expect(status.textContent).toBe("Enter an http:// or https:// URL");
	});
});
