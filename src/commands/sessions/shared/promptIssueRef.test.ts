import { describe, expect, it } from "vitest";
import { promptIssueRef } from "./promptIssueRef";

describe("promptIssueRef", () => {
	it("reads the issue a Next view Start session prompt names", () => {
		expect(
			promptIssueRef("Issue o/r#12: Fix it\nhttps://github.com/o/r/issues/12"),
		).toBe("o/r#12");
	});

	it("reads the issue a prompt led by its GitHub URL names", () => {
		expect(
			promptIssueRef(
				"https://github.com/o/r/issues/548\n\nis this not in uat already?",
			),
		).toBe("o/r#548");
		expect(promptIssueRef("https://github.com/o/r/issues/548")).toBe("o/r#548");
		expect(
			promptIssueRef("https://github.com/o/r/issues/548#issuecomment-1"),
		).toBe("o/r#548");
	});

	it("ignores prompts led by other GitHub URLs", () => {
		expect(promptIssueRef("https://github.com/o/r")).toBeUndefined();
		expect(promptIssueRef("https://github.com/o/r/pull/12")).toBeUndefined();
		expect(
			promptIssueRef("https://github.com/o/r/blob/main/issues/12"),
		).toBeUndefined();
		expect(promptIssueRef("https://github.com/o/r/issues")).toBeUndefined();
		expect(
			promptIssueRef("https://github.com/o/r/issues/12abc"),
		).toBeUndefined();
		expect(
			promptIssueRef("see https://github.com/o/r/issues/12"),
		).toBeUndefined();
	});

	it("ignores other prompts", () => {
		expect(promptIssueRef(undefined)).toBeUndefined();
		expect(promptIssueRef("fix o/r#12")).toBeUndefined();
		expect(promptIssueRef("Issue #12: Fix it")).toBeUndefined();
	});
});
