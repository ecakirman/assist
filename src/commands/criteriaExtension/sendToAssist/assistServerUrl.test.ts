import { afterEach, describe, expect, it, vi } from "vitest";
import { assistServerUrl } from "./assistServerUrl";

function stubStored(value: unknown) {
	vi.stubGlobal("browser", {
		storage: { local: { get: async () => ({ serverUrl: value }) } },
	});
}

afterEach(() => vi.unstubAllGlobals());

describe("assistServerUrl", () => {
	it("defaults to http://localhost:3100 without extension storage", async () => {
		expect(await assistServerUrl()).toBe("http://localhost:3100");
	});

	it("defaults when nothing is stored", async () => {
		stubStored(undefined);
		expect(await assistServerUrl()).toBe("http://localhost:3100");
	});

	it("reads the configured URL", async () => {
		stubStored("http://localhost:3200/");
		expect(await assistServerUrl()).toBe("http://localhost:3200");
	});

	it("ignores an invalid stored value", async () => {
		stubStored("not a url");
		expect(await assistServerUrl()).toBe("http://localhost:3100");
	});
});
