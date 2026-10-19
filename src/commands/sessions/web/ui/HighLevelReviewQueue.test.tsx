// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
	HighLevelPreviewPayload,
	HighLevelReviewRecord,
} from "../../../review/highLevel/types";
import { makeSessionInfo } from "../../../../test/mothers/makeSessionInfo";
import type { PrPreview } from "../../shared/SessionInfoBase";
import type { SessionInfo } from "./types";
import { HighLevelReviewPane } from "./App/SessionContent/PrPreviewSlideInPane/HighLevelReviewPane";

const payload: HighLevelPreviewPayload = {
	repo: "org/repo",
	prNumber: 42,
	checks: [
		{
			id: "tests-worth-having",
			kind: "manual",
			title: "The tests are worth having",
			short: "Tests",
			backing: "The describe/it hierarchy of changed tests",
			status: "manual",
			reason: "The describe/it hierarchy of changed tests",
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
	tests: [
		{
			path: "src/app.test.ts",
			status: "modified",
			additions: 4,
			deletions: 0,
			diffUrl: "https://github.com/org/repo/pull/42/files#diff-ghi",
			tests: [{ kind: "it", id: "src/app.test.ts:4", name: "starts", line: 4 }],
		},
	],
	testPaths: ["**/*.test.ts"],
	collapsedPaths: [],
};

const queued = {
	path: "src/app.test.ts",
	startLine: 4,
	endLine: 4,
	quote: "starts",
	note: "asserts nothing useful",
};

const liveSession = makeSessionInfo({
	id: "daemon-1",
	name: "review-42",
	commandType: "claude",
	status: "running",
});

function preview(saved?: HighLevelReviewRecord): PrPreview {
	return {
		requestId: "req-1",
		title: "org/repo#42 — A change",
		body: JSON.stringify({ ...payload, ...(saved ? { saved } : {}) }),
		prNumber: 42,
		kind: "high-level-review",
	};
}

function renderPane({
	saved,
	session = liveSession,
}: { saved?: HighLevelReviewRecord; session?: SessionInfo } = {}) {
	const onDecision = vi.fn();
	const sendInput = vi.fn();
	render(
		<HighLevelReviewPane
			preview={preview(saved)}
			session={session}
			sendInput={sendInput}
			onDecision={onDecision}
		/>,
	);
	return { onDecision, sendInput };
}

function writeTestComment(note: string) {
	fireEvent.click(screen.getByLabelText("Comment on the test starts"));
	fireEvent.change(screen.getByLabelText("Comment for starts"), {
		target: { value: note },
	});
}

function lastDecision(onDecision: ReturnType<typeof vi.fn>) {
	fireEvent.click(screen.getByRole("button", { name: "Comment" }));
	return onDecision.mock.calls.at(-1)?.[1];
}

afterEach(() => {
	cleanup();
	localStorage.clear();
});

describe("high-level review queue", () => {
	it("queues a test comment, clears the box and lists it with a count", () => {
		const { onDecision, sendInput } = renderPane();

		writeTestComment("asserts nothing useful");
		fireEvent.click(screen.getByRole("button", { name: "Add to review" }));

		expect(screen.queryByLabelText("Comment for starts")).toBeNull();
		expect(screen.getByText("Queued for review (1)")).toBeTruthy();
		expect(screen.getByText("asserts nothing useful")).toBeTruthy();
		expect(sendInput).not.toHaveBeenCalled();
		expect(lastDecision(onDecision)).toMatchObject({
			reviewEvent: "COMMENT",
			reviewComments: [queued],
		});
	});

	it("sends a test comment to the agent instead of queueing it", () => {
		const { onDecision, sendInput } = renderPane();

		writeTestComment("why this?");
		fireEvent.click(screen.getByRole("button", { name: "Send to agent" }));

		const [sessionId, data] = sendInput.mock.calls[0] as [string, string];
		expect(sessionId).toBe("daemon-1");
		expect(data).toContain("src/app.test.ts:4");
		expect(data).toContain("why this?");
		expect(screen.queryByLabelText("Comment for starts")).toBeNull();
		expect(screen.queryByText(/Queued for review/)).toBeNull();
		expect(lastDecision(onDecision)).toMatchObject({ reviewComments: [] });
	});

	it("only offers Add to review once the session is no longer live", () => {
		const { sendInput } = renderPane({
			session: { ...liveSession, status: "stopped" },
		});

		writeTestComment("note");

		expect(
			screen.getByText(
				"Comments are unavailable — that session is no longer live.",
			),
		).toBeTruthy();
		expect(
			(
				screen.getByRole("button", {
					name: "Send to agent",
				}) as HTMLButtonElement
			).disabled,
		).toBe(true);
		expect(
			(
				screen.getByRole("button", {
					name: "Add to review",
				}) as HTMLButtonElement
			).disabled,
		).toBe(false);
		expect(sendInput).not.toHaveBeenCalled();
	});

	it("removes a queued comment", () => {
		const { onDecision } = renderPane();

		writeTestComment("asserts nothing useful");
		fireEvent.click(screen.getByRole("button", { name: "Add to review" }));
		fireEvent.click(
			screen.getByLabelText("Remove the queued comment on src/app.test.ts:4"),
		);

		expect(screen.queryByText(/Queued for review/)).toBeNull();
		expect(lastDecision(onDecision)).toMatchObject({ reviewComments: [] });
	});

	it("restores the queue saved with the review", () => {
		const { onDecision } = renderPane({
			saved: {
				repo: "org/repo",
				prNumber: 42,
				headRef: "feat/thing",
				headSha: "abc123",
				verdict: "comment",
				reviewedAt: "2026-01-01T00:00:00.000Z",
				items: [],
				reviewComments: [queued],
			},
		});

		expect(screen.getByText("Queued for review (1)")).toBeTruthy();
		expect(lastDecision(onDecision)).toMatchObject({
			reviewComments: [queued],
		});
	});
});
