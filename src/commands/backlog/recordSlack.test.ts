import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	type MockInstance,
	vi,
} from "vitest";

vi.mock("../../shared/db/recordSessionRefs", () => ({
	recordSessionRefs: vi.fn(),
}));

import { recordSessionRefs } from "../../shared/db/recordSessionRefs";
import { recordSlack } from "./recordSlack";

const mockRecord = recordSessionRefs as unknown as MockInstance;
const URL = "https://x.slack.com/archives/C1/p1";

let logSpy: MockInstance;
let errorSpy: MockInstance;

beforeEach(() => {
	vi.clearAllMocks();
	logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
	errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
	process.exitCode = undefined;
});

afterEach(() => {
	logSpy.mockRestore();
	errorSpy.mockRestore();
	process.exitCode = undefined;
});

describe("recordSlack", () => {
	it("prints the item the link was attached to", async () => {
		mockRecord.mockResolvedValue({ status: "recorded", itemId: 1207 });
		await recordSlack(URL, { title: "PR" });
		expect(mockRecord).toHaveBeenCalledWith([
			{ kind: "slack", ref: URL, url: URL, title: "PR" },
		]);
		expect(logSpy.mock.calls[0][0]).toContain("a1207");
		expect(process.exitCode).toBeUndefined();
	});

	it("says nothing was recorded outside a backlog session", async () => {
		mockRecord.mockResolvedValue({ status: "no-session" });
		await recordSlack(URL, {});
		expect(logSpy.mock.calls[0][0]).toContain("not recorded");
		expect(process.exitCode).toBeUndefined();
	});

	it("reports a persist failure and exits non-zero", async () => {
		mockRecord.mockResolvedValue({
			status: "failed",
			itemId: 1207,
			error: new Error("db down"),
		});
		await recordSlack(URL, {});
		expect(errorSpy.mock.calls[0][0]).toContain("db down");
		expect(process.exitCode).toBe(1);
	});
});
