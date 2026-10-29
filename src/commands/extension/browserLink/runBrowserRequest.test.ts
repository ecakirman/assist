import { afterEach, describe, expect, it, vi } from "vitest";
import type { BrowserTab } from "./pickTargetTab";
import { runBrowserRequest } from "./runBrowserRequest";

function stubBrowser(tabs: BrowserTab[], sendMessage = vi.fn()) {
	vi.stubGlobal("browser", {
		runtime: { getManifest: () => ({ version: "1.0.0" }) },
		tabs: { query: async () => tabs, sendMessage },
		windows: { getLastFocused: async () => ({ id: 1 }) },
	});
	return sendMessage;
}

const github = {
	id: 7,
	windowId: 1,
	active: true,
	url: "https://github.com/a/b",
};

describe("runBrowserRequest", () => {
	afterEach(() => vi.unstubAllGlobals());

	it("reports the content script running on the target tab", async () => {
		stubBrowser([github], vi.fn().mockResolvedValue({ running: true }));
		await expect(runBrowserRequest({ op: "status" })).resolves.toEqual({
			ok: true,
			result: { tabUrl: github.url, contentScript: true },
		});
	});

	it("reports the content script missing when the tab does not answer", async () => {
		stubBrowser([github], vi.fn().mockRejectedValue(new Error("no receiver")));
		await expect(runBrowserRequest({ op: "status" })).resolves.toMatchObject({
			ok: true,
			result: { contentScript: false },
		});
	});

	it("refuses a tab outside the assist hosts and names its URL", async () => {
		const sendMessage = stubBrowser([
			{ ...github, url: "https://example.com/" },
		]);
		await expect(runBrowserRequest({ op: "status" })).resolves.toMatchObject({
			ok: false,
			tabUrl: "https://example.com/",
			error: expect.stringContaining("not on an assist host"),
		});
		expect(sendMessage).not.toHaveBeenCalled();
	});

	it("returns the content script's probe result with the tab URL", async () => {
		const sendMessage = stubBrowser(
			[github],
			vi.fn().mockResolvedValue({ running: true, result: { html: "<html>" } }),
		);
		await expect(runBrowserRequest({ op: "snapshot" })).resolves.toEqual({
			ok: true,
			result: { tabUrl: github.url, html: "<html>" },
		});
		expect(sendMessage).toHaveBeenCalledWith(7, {
			op: "snapshot",
			type: "assist-browser-probe",
		});
	});

	it("passes the content script's probe error back", async () => {
		stubBrowser(
			[github],
			vi.fn().mockResolvedValue({ running: true, error: "bad selector" }),
		);
		await expect(
			runBrowserRequest({ op: "inspect", selector: "[" }),
		).resolves.toEqual({
			ok: false,
			tabUrl: github.url,
			error: "bad selector",
		});
	});

	it("fails a probe when the content script does not answer", async () => {
		stubBrowser([github], vi.fn().mockRejectedValue(new Error("no receiver")));
		await expect(runBrowserRequest({ op: "snapshot" })).resolves.toMatchObject({
			ok: false,
			error: expect.stringContaining("content script is not running"),
		});
	});

	it("says when no tab matches --url", async () => {
		stubBrowser([github]);
		await expect(
			runBrowserRequest({ op: "status", url: "gitlab" }),
		).resolves.toMatchObject({
			ok: false,
			error: expect.stringContaining('containing "gitlab"'),
		});
	});
});
