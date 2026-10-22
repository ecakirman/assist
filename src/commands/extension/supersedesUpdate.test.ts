import { describe, expect, it } from "vitest";
import { supersedesUpdate } from "./supersedesUpdate";

describe("supersedesUpdate", () => {
	it("publishes over an older listed version", () => {
		expect(supersedesUpdate("0.874.0", "0.873.1")).toBe(true);
	});

	it("publishes when no version is listed", () => {
		expect(supersedesUpdate("0.874.0", undefined)).toBe(true);
	});

	it("keeps an equal or newer listed version", () => {
		expect(supersedesUpdate("0.874.0", "0.874.0")).toBe(false);
		expect(supersedesUpdate("0.873.1", "0.874.0")).toBe(false);
	});
});
