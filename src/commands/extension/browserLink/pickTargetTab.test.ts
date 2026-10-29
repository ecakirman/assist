import { describe, expect, it } from "vitest";
import { type BrowserTab, pickTargetTab } from "./pickTargetTab";

const tabs: BrowserTab[] = [
	{
		id: 1,
		windowId: 1,
		active: true,
		lastAccessed: 300,
		url: "https://github.com/a/b/pull/1",
	},
	{
		id: 2,
		windowId: 2,
		active: true,
		lastAccessed: 200,
		url: "https://dev.azure.com/o/p",
	},
	{
		id: 3,
		windowId: 2,
		active: false,
		lastAccessed: 500,
		url: "https://github.com/a/b/pull/2",
	},
	{
		id: 4,
		windowId: 1,
		active: false,
		lastAccessed: 100,
		url: "https://github.com/a/b/pull/3",
	},
];

describe("pickTargetTab", () => {
	it("targets the focused window's active tab by default", () => {
		expect(pickTargetTab(tabs, 2)?.id).toBe(2);
	});

	it("falls back to the most recently active tab when no window is focused", () => {
		expect(pickTargetTab(tabs, undefined)?.id).toBe(1);
	});

	it("targets the most recently accessed tab whose URL matches", () => {
		expect(pickTargetTab(tabs, 2, "github.com/a/b")?.id).toBe(3);
		expect(pickTargetTab(tabs, 2, "pull/3")?.id).toBe(4);
	});

	it("finds nothing when no URL matches", () => {
		expect(pickTargetTab(tabs, 1, "gitlab")).toBeUndefined();
	});
});
