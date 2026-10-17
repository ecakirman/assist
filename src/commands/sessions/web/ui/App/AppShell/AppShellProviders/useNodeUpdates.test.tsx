// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { NodeSelection } from "../../../useNodeSelection";
import { useNodeUpdates } from "./useNodeUpdates";

afterEach(() => {
	vi.unstubAllGlobals();
});

const selection = {
	nodes: { local: "wsl" },
	names: ["wsl", "win"],
} as unknown as NodeSelection;

describe("useNodeUpdates", () => {
	it("renders the local row while a linked node is still pending", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn((url: string) =>
				url.includes("node=")
					? new Promise(() => {})
					: Promise.resolve({
							ok: true,
							status: 200,
							json: async () => ({ nodeName: "wsl" }),
						}),
			),
		);

		const { result } = renderHook(() => useNodeUpdates(selection));

		await waitFor(() =>
			expect(result.current.entries[0]?.status).toEqual({ nodeName: "wsl" }),
		);
		expect(result.current.loading).toBe(false);
		expect(result.current.entries[1]).toMatchObject({
			name: "win",
			loading: true,
		});
	});

	it("shows an error for a linked node that times out", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(() => Promise.reject(new DOMException("t", "TimeoutError"))),
		);

		const { result } = renderHook(() => useNodeUpdates(selection));

		await waitFor(() =>
			expect(result.current.entries[1]?.error).toBe("No response after 15s"),
		);
	});
});
