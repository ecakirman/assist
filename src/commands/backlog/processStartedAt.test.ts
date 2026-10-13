import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import type * as fsMockModule from "../../test/mocks/fsMock";

vi.mock("node:fs", async () =>
	(
		await vi.importActual<typeof fsMockModule>("../../test/mocks/fsMock")
	).fsMock(),
);
vi.mock("./bootedAt", () => ({ bootedAt: () => 1_000_000 }));

import { processStartedAt } from "./processStartedAt";

describe("processStartedAt", () => {
	it("reads the start time even when the command name holds spaces and parens", () => {
		vi.mocked(readFileSync).mockReturnValue(
			"1712 (node (x) y) S 1 1712 1712 0 -1 4194304 132 0 0 0 0 0 0 0 20 0 1 0 12345 3362816 401",
		);

		expect(processStartedAt(1712)).toBe(1_000_000 + 123_450);
		expect(readFileSync).toHaveBeenCalledWith("/proc/1712/stat", "utf8");
	});

	it("returns undefined when the pid has no /proc entry", () => {
		vi.mocked(readFileSync).mockImplementation(() => {
			throw new Error("ENOENT");
		});

		expect(processStartedAt(1712)).toBeUndefined();
	});
});
