import { describe, expect, it, vi } from "vitest";
import { waitForMergeable } from "./waitForMergeable";

describe("waitForMergeable", () => {
	it("returns a known state without re-polling", () => {
		const refetch = vi.fn();
		expect(waitForMergeable("CONFLICTING", refetch, 0)).toBe("CONFLICTING");
		expect(refetch).not.toHaveBeenCalled();
	});

	it("re-polls an unknown state until GitHub resolves it", () => {
		const refetch = vi
			.fn()
			.mockReturnValueOnce("UNKNOWN")
			.mockReturnValueOnce("MERGEABLE");
		expect(waitForMergeable("UNKNOWN", refetch, 0)).toBe("MERGEABLE");
		expect(refetch).toHaveBeenCalledTimes(2);
	});

	it("gives up after a bounded number of re-polls", () => {
		const refetch = vi.fn().mockReturnValue("UNKNOWN");
		expect(waitForMergeable("UNKNOWN", refetch, 0)).toBe("UNKNOWN");
		expect(refetch).toHaveBeenCalledTimes(4);
	});
});
