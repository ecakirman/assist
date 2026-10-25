import { describe, expect, it } from "vitest";
import { previewPageMeta } from "./previewPageMeta";

describe("previewPageMeta", () => {
	it("names the page in the meta the extension looks for", () => {
		expect(previewPageMeta("updating")).toEqual({
			tag: "meta",
			attrs: { name: "assist-docs-page", content: "updating" },
			content: "",
		});
	});
});
