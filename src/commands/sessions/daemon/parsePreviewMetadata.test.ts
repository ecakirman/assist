import { describe, expect, it } from "vitest";
import { parsePreviewMetadata } from "./parsePreviewMetadata";

describe("parsePreviewMetadata", () => {
	it("keeps well-formed entries", () => {
		expect(
			parsePreviewMetadata([{ label: "Repository", value: "acme/widgets" }]),
		).toEqual([{ label: "Repository", value: "acme/widgets" }]);
	});

	it("keeps a string url", () => {
		expect(
			parsePreviewMetadata([
				{ label: "Parent", value: "acme/widgets#1", url: "https://x/1" },
				{ label: "Type", value: "Epic", url: 7 },
			]),
		).toEqual([
			{ label: "Parent", value: "acme/widgets#1", url: "https://x/1" },
			{ label: "Type", value: "Epic" },
		]);
	});

	it("drops entries that are not a label and a value", () => {
		expect(
			parsePreviewMetadata([{ label: "Type" }, "Epic", null, { value: "x" }]),
		).toBeUndefined();
	});

	it("ignores anything that is not an array", () => {
		expect(parsePreviewMetadata("Repository: acme/widgets")).toBeUndefined();
	});
});
