import { describe, expect, it } from "vitest";
import { buildReviewBody } from "./buildReviewBody";

const markdown = "## Summary\nClaude found one issue.\n";
const footer = "Models: reviewer 1 `claude:claude-opus`";

describe("buildReviewBody", () => {
	it("ends with the CI footer, its model names unsanitised", () => {
		const body = buildReviewBody(markdown, [], footer);

		expect(body).toContain("the reviewer found one issue.");
		expect(body.endsWith(`\n\n${footer}`)).toBe(true);
	});

	it("adds no footer outside CI", () => {
		const body = buildReviewBody(markdown, []);

		expect(body).not.toContain("Models:");
		expect(body).not.toContain("ready for review");
	});
});
