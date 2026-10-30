import { describe, expect, it } from "vitest";
import { createDesignTheme } from "../../../../../../designSystem/createDesignTheme";
import { previewBodySx } from "./previewBodySx";

const theme = createDesignTheme("dark");
const markdownRules = () => previewBodySx(theme)["& .markdown"];

describe("previewBodySx", () => {
	it("renders blockquotes as quotes", () => {
		expect(markdownRules()["& blockquote"]).toMatchObject({
			pl: 2,
			borderLeft: 4,
			borderColor: "divider",
			color: "text.secondary",
		});
	});

	it("styles the block elements the backlog markdown styles", () => {
		const rules = markdownRules();
		for (const selector of [
			"& h1, & h2, & h3, & h4, & h5, & h6",
			"& ul, & ol",
			"& code",
			"& pre",
			"& table",
			"& hr",
		] as const) {
			expect(rules[selector]).toBeDefined();
		}
	});

	it("keeps the preview highlight styling", () => {
		expect(previewBodySx(theme)["& mark.pr-comment"]).toMatchObject({
			color: "inherit",
		});
	});
});
