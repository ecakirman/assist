import { describe, expect, it } from "vitest";
import type { HighLevelOverlaySubject } from "./HighLevelOverlaySubject";
import { highLevelPreviewMetadata } from "./highLevelPreviewMetadata";

const subject = {
	headRef: "feat/thing",
	headSha: "abc1234567",
	structure: { added: 3, removed: 0, modified: 2 },
	criticalDiffs: [{ path: "a.ts" }],
	tests: [],
} as unknown as HighLevelOverlaySubject;

describe("highLevelPreviewMetadata", () => {
	it("shows the branch and head without the change counts", () => {
		expect(highLevelPreviewMetadata(subject)).toEqual([
			{ label: "Branch", value: "feat/thing" },
			{ label: "Head", value: "abc1234" },
		]);
	});

	it("adds when a saved review was reopened from", () => {
		expect(
			highLevelPreviewMetadata({
				...subject,
				saved: { reviewedAt: "2026-10-20" },
			} as HighLevelOverlaySubject).at(-1),
		).toEqual({ label: "Reopened from", value: "2026-10-20" });
	});
});
