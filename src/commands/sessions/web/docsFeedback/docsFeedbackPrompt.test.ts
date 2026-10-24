import { describe, expect, it } from "vitest";
import { docsFeedbackPrompt } from "./docsFeedbackPrompt";

describe("docsFeedbackPrompt", () => {
	it("names the page, section and source, quotes the selection, then the prompt", () => {
		expect(
			docsFeedbackPrompt({
				pageId: "getting-started",
				heading: "Install",
				source: "docs/guide/pages/getting-started.json",
				selection: " first line\nsecond line ",
				prompt: " Reword this ",
			}),
		).toBe(
			[
				'Docs feedback on page `getting-started`, section "Install" (docs/guide/pages/getting-started.json):',
				"> first line\n> second line",
				"Reword this",
			].join("\n\n"),
		);
	});
});
