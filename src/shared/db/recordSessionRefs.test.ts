import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./getDb", () => ({
	getDb: vi.fn(),
	closeDb: vi.fn(() => Promise.resolve()),
}));

vi.mock("./recordGitRef", () => ({
	recordGitRef: vi.fn(() => Promise.resolve()),
}));

import { closeDb, getDb } from "./getDb";
import { recordGitRef } from "./recordGitRef";
import { recordSessionRefs } from "./recordSessionRefs";

const mockGetDb = getDb as unknown as ReturnType<typeof vi.fn>;
const mockRecordGitRef = recordGitRef as unknown as ReturnType<typeof vi.fn>;
const mockCloseDb = closeDb as unknown as ReturnType<typeof vi.fn>;
const ENV = "ASSIST_BACKLOG_ITEM_ID";

beforeEach(() => {
	delete process.env[ENV];
	vi.clearAllMocks();
	mockGetDb.mockResolvedValue({});
});

afterEach(() => {
	delete process.env[ENV];
});

describe("recordSessionRefs", () => {
	it("does nothing outside a run (no session item id)", async () => {
		await expect(
			recordSessionRefs([{ kind: "branch", ref: "feature" }]),
		).resolves.toEqual({ status: "no-session" });
		expect(mockGetDb).not.toHaveBeenCalled();
		expect(mockRecordGitRef).not.toHaveBeenCalled();
	});

	it("records each ref against the session item and closes the db", async () => {
		process.env[ENV] = "611";
		await expect(
			recordSessionRefs([
				{ kind: "branch", ref: "feature" },
				{ kind: "commit", ref: "abc" },
			]),
		).resolves.toEqual({ status: "recorded", itemId: 611 });
		expect(mockRecordGitRef).toHaveBeenCalledTimes(2);
		expect(mockRecordGitRef).toHaveBeenCalledWith({}, 611, {
			kind: "branch",
			ref: "feature",
		});
		expect(mockCloseDb).toHaveBeenCalled();
	});

	it("reports recording failures without throwing", async () => {
		process.env[ENV] = "611";
		const error = new Error("db down");
		mockRecordGitRef.mockRejectedValueOnce(error);
		await expect(
			recordSessionRefs([{ kind: "commit", ref: "abc" }]),
		).resolves.toEqual({ status: "failed", itemId: 611, error });
		expect(mockCloseDb).toHaveBeenCalled();
	});
});
