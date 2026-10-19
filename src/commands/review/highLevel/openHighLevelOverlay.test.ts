import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type {
	PreviewDecision,
	PreviewReviewComment,
} from "../../sessions/shared/PreviewDecision";
import type { PreviewRequest } from "../../sessions/shared/requestPreviewDecision";
import type { HighLevelOverlaySubject } from "./HighLevelOverlaySubject";
import { openHighLevelOverlay } from "./openHighLevelOverlay";
import type { HighLevelFile } from "./types";

const mockAwaitPreviewApproval =
	vi.fn<
		(subject: string, request: PreviewRequest) => Promise<PreviewDecision>
	>();
const mockSaveHighLevelReview = vi.fn(() => "/store/review.json");

vi.mock("../../sessions/shared/awaitPreviewApproval", () => ({
	awaitPreviewApproval: (subject: string, request: PreviewRequest) =>
		mockAwaitPreviewApproval(subject, request),
}));

const mockExecFileSync = vi.fn();

vi.mock("node:child_process", () => ({
	execFileSync: (...args: unknown[]) => mockExecFileSync(...args),
}));

vi.mock("./saveHighLevelReview", () => ({
	saveHighLevelReview: (...args: unknown[]) =>
		mockSaveHighLevelReview(...(args as [])),
}));

const mockFetchHighLevelFiles = vi.fn<() => HighLevelFile[]>();

vi.mock("./fetchHighLevelFiles", () => ({
	fetchHighLevelFiles: () => mockFetchHighLevelFiles(),
}));

const subject: HighLevelOverlaySubject = {
	repo: "org/repo",
	prNumber: 42,
	title: "A change",
	headRef: "feat/thing",
	headSha: "abc123",
	checks: [
		{
			id: "structure-sensible",
			kind: "manual",
			title: "Structure",
			short: "Structure",
			backing: "tree",
			status: "manual",
			reason: "tree",
		},
	],
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

const queued: PreviewReviewComment = {
	path: "src/a.test.ts",
	startLine: 4,
	endLine: 4,
	quote: "starts",
	note: "asserts nothing",
};

const expectedBody = [
	"**Structure**",
	"",
	"Split it",
	"",
	"**Comments**",
	"",
	"- `src/a.test.ts:4` starts: asserts nothing",
].join("\n");

function ghReview(
	event: string,
	body?: string,
	comments: Record<string, unknown>[] = [],
) {
	return [
		"gh",
		[
			"api",
			"repos/org/repo/pulls/42/reviews",
			"--method",
			"POST",
			"--input",
			"-",
		],
		expect.objectContaining({
			input: JSON.stringify({ event, ...(body ? { body } : {}), comments }),
		}),
	];
}

function queuedDecision(
	decision: PreviewDecision["decision"],
	reviewEvent: PreviewDecision["reviewEvent"],
): PreviewDecision {
	return {
		decision,
		reviewEvent,
		checklist: [
			{ id: "structure-sensible", ticked: true, comment: "Split it" },
		],
		reviewComments: [queued],
	};
}

let log: ReturnType<typeof vi.spyOn>;
let error: ReturnType<typeof vi.spyOn>;
let exit: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
	mockAwaitPreviewApproval.mockReset();
	mockSaveHighLevelReview.mockClear();
	mockExecFileSync.mockReset();
	mockFetchHighLevelFiles.mockReset().mockReturnValue([]);
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
		expect(mockExecFileSync).not.toHaveBeenCalled();
		expect(log).toHaveBeenCalledWith(
			"Review closed without a verdict. Nothing was saved.",
		);
	});

	it("approves straight away with an empty queue", async () => {
		mockAwaitPreviewApproval.mockResolvedValue({
			decision: "approve",
			reviewEvent: "APPROVE",
			checklist: [],
		});

		const record = await openHighLevelOverlay("s1", subject);

		expect(record?.verdict).toBe("approve");
		expect(mockSaveHighLevelReview).toHaveBeenCalledWith(record);
		expect(mockAwaitPreviewApproval).toHaveBeenCalledOnce();
		expect(mockFetchHighLevelFiles).not.toHaveBeenCalled();
		expect(mockExecFileSync).toHaveBeenCalledWith(...ghReview("APPROVE"));
		expect(log).toHaveBeenCalledWith("Review (APPROVE) posted to org/repo#42.");
	});

	it.each([
		["approve", "APPROVE", "Approve org/repo#42"],
		["approve", "COMMENT", "Comment on org/repo#42"],
		["reject", "REQUEST_CHANGES", "Request changes on org/repo#42"],
	] as const)(
		"previews the queued %s/%s review and submits it once approved",
		async (decision, reviewEvent, title) => {
			mockAwaitPreviewApproval
				.mockResolvedValueOnce(queuedDecision(decision, reviewEvent))
				.mockResolvedValueOnce({ decision: "approve" });

			const record = await openHighLevelOverlay("s1", subject);

			expect(record?.reviewComments).toEqual([queued]);
			expect(mockAwaitPreviewApproval).toHaveBeenLastCalledWith(
				"Review",
				expect.objectContaining({ title, body: expectedBody }),
			);
			expect(mockExecFileSync).toHaveBeenCalledOnce();
			expect(mockExecFileSync).toHaveBeenCalledWith(
				...ghReview(reviewEvent, expectedBody),
			);
		},
	);

	it("posts queued comments on diff lines as line-level comments", async () => {
		mockFetchHighLevelFiles.mockReturnValue([
			{
				path: "src/a.test.ts",
				status: "modified",
				additions: 1,
				deletions: 0,
				diffUrl: "https://github.com/org/repo/pull/42/files#diff-a",
				patch: "@@ -3,1 +3,2 @@\n keep\n+starts",
			},
		]);
		mockAwaitPreviewApproval
			.mockResolvedValueOnce(queuedDecision("approve", "COMMENT"))
			.mockResolvedValueOnce({ decision: "approve" });

		await openHighLevelOverlay("s1", subject);

		expect(mockAwaitPreviewApproval).toHaveBeenLastCalledWith(
			"Review",
			expect.objectContaining({
				body: [
					"### Line-level comments",
					"",
					"- `src/a.test.ts:4` starts: asserts nothing",
					"",
					"### PR-level body",
					"",
					"**Structure**",
					"",
					"Split it",
				].join("\n"),
			}),
		);
		expect(mockExecFileSync).toHaveBeenCalledWith(
			...ghReview("COMMENT", "**Structure**\n\nSplit it", [
				{
					path: "src/a.test.ts",
					body: "asserts nothing",
					line: 4,
					side: "RIGHT",
				},
			]),
		);
	});

	it("puts every queued comment in the PR-level body when the diff can't be read", async () => {
		mockFetchHighLevelFiles.mockImplementation(() => {
			throw new Error("offline");
		});
		mockAwaitPreviewApproval
			.mockResolvedValueOnce(queuedDecision("approve", "COMMENT"))
			.mockResolvedValueOnce({ decision: "approve" });

		await openHighLevelOverlay("s1", subject);

		expect(mockExecFileSync).toHaveBeenCalledWith(
			...ghReview("COMMENT", expectedBody),
		);
	});

	it.each([
		["rejected", { decision: "reject" }],
		["closed", { decision: "reject", dismissed: true }],
	] as const)(
		"posts nothing when the review preview is %s",
		async (_label, preview) => {
			mockAwaitPreviewApproval
				.mockResolvedValueOnce(queuedDecision("approve", "COMMENT"))
				.mockResolvedValueOnce(preview);

			const record = await openHighLevelOverlay("s1", subject);

			expect(mockSaveHighLevelReview).toHaveBeenCalledWith(record);
			expect(mockExecFileSync).not.toHaveBeenCalled();
			expect(log).toHaveBeenCalledWith("Nothing was posted to GitHub.");
		},
	);

	it("posts nothing when changes are requested with nothing to say", async () => {
		mockAwaitPreviewApproval.mockResolvedValue({
			decision: "reject",
			checklist: [],
		});

		const record = await openHighLevelOverlay("s1", subject);

		expect(record?.verdict).toBe("request-changes");
		expect(mockAwaitPreviewApproval).toHaveBeenCalledOnce();
		expect(mockExecFileSync).not.toHaveBeenCalled();
		expect(log).toHaveBeenCalledWith("Nothing was posted to GitHub.");
	});

	it("keeps the saved record, prints the gh error and exits non-zero when the review fails", async () => {
		mockAwaitPreviewApproval.mockResolvedValue({
			decision: "approve",
			checklist: [],
		});
		mockExecFileSync.mockImplementation(() => {
			throw Object.assign(new Error("failed"), {
				stderr: "Can not approve your own pull request\n",
			});
		});

		await expect(openHighLevelOverlay("s1", subject)).rejects.toThrow("exit 1");

		expect(mockSaveHighLevelReview).toHaveBeenCalled();
		expect(error).toHaveBeenCalledWith(
			"Could not post the review to org/repo#42: Can not approve your own pull request",
		);
	});
});
