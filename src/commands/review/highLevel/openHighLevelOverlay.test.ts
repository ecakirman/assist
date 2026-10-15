import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PreviewDecision } from "../../sessions/shared/PreviewDecision";
import type { HighLevelOverlaySubject } from "./HighLevelOverlaySubject";
import { openHighLevelOverlay } from "./openHighLevelOverlay";

const mockAwaitPreviewApproval = vi.fn<() => Promise<PreviewDecision>>();
const mockSaveHighLevelReview = vi.fn(() => "/store/review.json");

vi.mock("../../sessions/shared/awaitPreviewApproval", () => ({
	awaitPreviewApproval: () => mockAwaitPreviewApproval(),
}));

vi.mock("./saveHighLevelReview", () => ({
	saveHighLevelReview: (...args: unknown[]) =>
		mockSaveHighLevelReview(...(args as [])),
}));

const subject: HighLevelOverlaySubject = {
	repo: "org/repo",
	prNumber: 42,
	title: "A change",
	headRef: "feat/thing",
	headSha: "abc123",
	checks: [],
	structure: {
		tree: [],
		added: 0,
		removed: 0,
		modified: 0,
		additions: 0,
		deletions: 0,
	},
	criticalDiffs: [],
	criticalPaths: [],
	tests: [],
	testPaths: [],
	collapsedPaths: [],
};

let log: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
	mockAwaitPreviewApproval.mockReset();
	mockSaveHighLevelReview.mockClear();
	log = vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
	log.mockRestore();
});

describe("openHighLevelOverlay", () => {
	it("saves nothing when the review is closed without a verdict", async () => {
		mockAwaitPreviewApproval.mockResolvedValue({
			decision: "reject",
			dismissed: true,
			checklist: [],
		});

		const record = await openHighLevelOverlay("s1", subject);

		expect(record).toBeUndefined();
		expect(mockSaveHighLevelReview).not.toHaveBeenCalled();
		expect(log).toHaveBeenCalledWith(
			"Review closed without a verdict. Nothing was saved.",
		);
	});

	it("saves a request-changes verdict when changes are requested", async () => {
		mockAwaitPreviewApproval.mockResolvedValue({
			decision: "reject",
			checklist: [],
		});

		const record = await openHighLevelOverlay("s1", subject);

		expect(record?.verdict).toBe("request-changes");
		expect(mockSaveHighLevelReview).toHaveBeenCalledWith(record);
	});
});
