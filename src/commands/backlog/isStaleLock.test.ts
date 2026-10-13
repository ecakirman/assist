import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./bootedAt", () => ({ bootedAt: vi.fn() }));
vi.mock("./processStartedAt", () => ({ processStartedAt: vi.fn() }));

import { bootedAt } from "./bootedAt";
import { isStaleLock } from "./isStaleLock";
import { processStartedAt } from "./processStartedAt";

const boot = Date.parse("2026-10-13T00:07:00Z");
const lockedAt = "2026-10-13T01:00:00Z";

describe("isStaleLock", () => {
	beforeEach(() => {
		vi.mocked(bootedAt).mockReturnValue(boot);
		vi.mocked(processStartedAt).mockReturnValue(
			Date.parse("2026-10-13T00:59:58Z"),
		);
	});

	it("treats a lock written before the current boot as stale", () => {
		expect(isStaleLock(1712, "2026-10-12T23:42:02Z")).toBe(true);
	});

	it("treats a lock whose pid started after the lock was written as stale", () => {
		vi.mocked(processStartedAt).mockReturnValue(
			Date.parse("2026-10-13T01:05:00Z"),
		);

		expect(isStaleLock(1712, lockedAt)).toBe(true);
	});

	it("keeps a lock held by the process that wrote it", () => {
		expect(isStaleLock(1712, lockedAt)).toBe(false);
	});

	it("keeps the lock when the pid's start time is unknown", () => {
		vi.mocked(processStartedAt).mockReturnValue(undefined);

		expect(isStaleLock(1712, lockedAt)).toBe(false);
	});

	it("keeps a lock with no usable timestamp", () => {
		expect(isStaleLock(1712, undefined)).toBe(false);
		expect(isStaleLock(1712, "not a date")).toBe(false);
	});
});
