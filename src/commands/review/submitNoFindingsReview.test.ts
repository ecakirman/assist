import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSubmitBodyOnlyReview = vi.fn();

vi.mock("./submitBodyOnlyReview", () => ({
	submitBodyOnlyReview: (...args: unknown[]) =>
		mockSubmitBodyOnlyReview(...args),
}));

import { submitNoFindingsReview } from "./submitNoFindingsReview";

const markdown = "## Summary\nClaude found the change sound.\n";
const footer = "Models: reviewer 1 `claude:claude-opus`";

beforeEach(() => {
	vi.clearAllMocks();
});

describe("submitNoFindingsReview", () => {
	it("submits the synthesis summary with a no-findings line and the footer", () => {
		submitNoFindingsReview(markdown, footer);

		const body = mockSubmitBodyOnlyReview.mock.calls[0][0] as string;
		expect(body).toContain("## Code review summary");
		expect(body).toContain("found the change sound.");
		expect(body).toContain("No findings were raised.");
		expect(body.endsWith(footer)).toBe(true);
	});

	it("sanitises the summary but not the footer's model names", () => {
		submitNoFindingsReview(markdown, footer);

		const body = mockSubmitBodyOnlyReview.mock.calls[0][0] as string;
		expect(body).toContain("the reviewer found the change sound.");
		expect(body).toContain("`claude:claude-opus`");
	});
});
