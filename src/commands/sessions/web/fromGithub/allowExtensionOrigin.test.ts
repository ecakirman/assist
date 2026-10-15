import type { IncomingMessage, ServerResponse } from "node:http";
import { describe, expect, it, vi } from "vitest";
import { allowExtensionOrigin } from "./allowExtensionOrigin";

function allowed(origin?: string): string | undefined {
	const setHeader = vi.fn();
	allowExtensionOrigin(
		{ headers: { origin } } as IncomingMessage,
		{ setHeader } as unknown as ServerResponse,
	);
	return setHeader.mock.calls.find(
		([name]) => name === "Access-Control-Allow-Origin",
	)?.[1];
}

describe("allowExtensionOrigin", () => {
	it("allows browser extension origins", () => {
		expect(allowed("moz-extension://abc-123")).toBe("moz-extension://abc-123");
		expect(allowed("chrome-extension://abc")).toBe("chrome-extension://abc");
	});

	it("does not open the endpoint to web pages", () => {
		expect(allowed("https://github.com")).toBeUndefined();
		expect(allowed("https://evil.example/moz-extension://x")).toBeUndefined();
		expect(allowed(undefined)).toBeUndefined();
	});
});
