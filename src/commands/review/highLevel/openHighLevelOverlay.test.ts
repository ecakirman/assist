import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PreviewDecision } from "../../sessions/shared/PreviewDecision";
import type { HighLevelOverlaySubject } from "./HighLevelOverlaySubject";
import { openHighLevelOverlay } from "./openHighLevelOverlay";

const mockAwaitPreviewApproval = vi.fn<() => Promise<PreviewDecision>>();
const mockSaveHighLevelReview = vi.fn(() => "/store/review.json");

vi.mock("../../sessions/shared/awaitPreviewApproval", () => ({
	awaitPreviewApproval: () => mockAwaitPreviewApproval(),
}));

const mockPostHighLevelApproval = vi.fn();

vi.mock("./postHighLevelApproval", () => ({
	postHighLevelApproval: (...args: unknown[]) =>
		mockPostHighLevelApproval(...args),
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
let error: ReturnType<typeof vi.spyOn>;
let exit: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
	mockAwaitPreviewApproval.mockReset();
	mockSaveHighLevelReview.mockClear();
	mockPostHighLevelApproval.mockReset();
	log = vi.spyOn(console, "log").mockImplementation(() => {});
	error = vi.spyOn(console, "error").mockImplementation(() => {});
	exit = vi.spyOn(process, "exit").mockImplementation((code) => {
		throw new Error(`exit ${code}`);
	});
});

afterEach(() => {
	log.mockRestore();
	error.mockRestore();
	exit.mockRestore();
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
		expect(mockPostHighLevelApproval).not.toHaveBeenCalled();
		expect(log).toHaveBeenCalledWith(
			"Review closed without a verdict. Nothing was saved.",
		);
	});

	it("saves the record and approves the PR on GitHub when approved", async () => {
		mockAwaitPreviewApproval.mockResolvedValue({
			decision: "approve",
			checklist: [],
		});

		const record = await openHighLevelOverlay("s1", subject);

		expect(record?.verdict).toBe("approve");
		expect(mockSaveHighLevelReview).toHaveBeenCalledWith(record);
		expect(mockPostHighLevelApproval).toHaveBeenCalledWith("org/repo", 42);
		expect(log).toHaveBeenCalledWith("Approval posted to org/repo#42.");
		expect(log).not.toHaveBeenCalledWith("Nothing was posted to GitHub.");
	});

	it("keeps the saved record, prints the gh error and exits non-zero when the approval fails", async () => {
		mockAwaitPreviewApproval.mockResolvedValue({
			decision: "approve",
			checklist: [],
		});
		mockPostHighLevelApproval.mockImplementation(() => {
			throw new Error("Can not approve your own pull request");
		});

		await expect(openHighLevelOverlay("s1", subject)).rejects.toThrow("exit 1");

		expect(mockSaveHighLevelReview).toHaveBeenCalled();
		expect(error).toHaveBeenCalledWith(
			"Could not post the approval to org/repo#42: Can not approve your own pull request",
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
		expect(mockPostHighLevelApproval).not.toHaveBeenCalled();
		expect(log).toHaveBeenCalledWith("Nothing was posted to GitHub.");
	});
});
