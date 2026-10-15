import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReviewerResult } from "./runStreamingChild";

const mockSubmitBodyOnlyReview = vi.fn();

vi.mock("./submitBodyOnlyReview", () => ({
	submitBodyOnlyReview: (...args: unknown[]) =>
		mockSubmitBodyOnlyReview(...args),
}));

import { submitFailedReview } from "./submitFailedReview";

const footer = "Models: reviewer 2 `codex:gpt-6.1-sol`";
const runUrl = "https://github.com/o/r/actions/runs/1";

function failure(name: string): ReviewerResult {
	return { name, outputPath: "", exitCode: 1, stderr: "" };
}

function submittedBody(): string {
	return mockSubmitBodyOnlyReview.mock.calls[0][0] as string;
}

beforeEach(() => {
	vi.clearAllMocks();
});

describe("submitFailedReview", () => {
	it("names the failed steps, links the run and ends with the footer", () => {
		submitFailedReview([failure("reviewer-2")], footer, runUrl);

		const body = submittedBody();
		expect(body).toContain("## Code review failed");
		expect(body).toContain("reviewer 2 failed.");
		expect(body).toContain(`[workflow run](${runUrl})`);
		expect(body.endsWith(footer)).toBe(true);
	});

	it("joins several failures and omits the link without a run URL", () => {
		submitFailedReview([failure("reviewer-1"), failure("reviewer-2")], footer);

		const body = submittedBody();
		expect(body).toContain("reviewer 1 and reviewer 2 failed.");
		expect(body).not.toContain("workflow run");
	});
});
