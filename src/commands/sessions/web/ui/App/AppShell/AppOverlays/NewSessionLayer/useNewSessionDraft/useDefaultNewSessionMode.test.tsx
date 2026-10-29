// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import type { NewSessionMode } from "../newSessionModes";
import { useDefaultNewSessionMode } from "./useDefaultNewSessionMode";
import { RepoSelectionContext } from "../../../../../useRepoSelectionContext";

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

const repos = ["/git/alpha", "/git/beta"];

function wrapper({ children }: { children: ReactNode }) {
	return (
		<RepoSelectionContext.Provider
			value={{
				repos,
				selectedCwd: "/git/alpha",
				worktreeCwd: "/git/alpha",
				setSelectedCwd: vi.fn(),
				cloneOn: (cwd) => cwd,
				originOf: () => undefined,
			}}
		>
			{children}
		</RepoSelectionContext.Provider>
	);
}

function stubModes(modes: Record<string, NewSessionMode>) {
	const fetch = vi.fn(async () => Response.json({ modes: { ...modes } }));
	vi.stubGlobal("fetch", fetch);
	return fetch;
}

it("loads every repo's mode in one request so switching repos is immediate", async () => {
	const fetch = stubModes({ "/git/alpha": "draft", "/git/beta": "prompt" });
	const { result, rerender } = renderHook(
		({ cwd }) => useDefaultNewSessionMode(cwd, true),
		{ wrapper, initialProps: { cwd: "/git/alpha" } },
	);
	await act(async () => {});

	rerender({ cwd: "/git/beta" });

	expect(result.current).toEqual({ mode: "prompt", pending: false });
	expect(fetch).toHaveBeenCalledTimes(1);
	expect(fetch).toHaveBeenCalledWith(
		"/api/new-session-defaults?cwd=%2Fgit%2Falpha&cwd=%2Fgit%2Fbeta",
	);
});

it("finishes loading while the repo list reorders mid-request", async () => {
	let release = () => {};
	const fetch = vi.fn(async () => {
		await new Promise<void>((resolve) => {
			release = resolve;
		});
		return Response.json({
			modes: { "/git/alpha": "prompt", "/git/beta": "draft" },
		});
	});
	vi.stubGlobal("fetch", fetch);
	let order = repos;
	const reorderingWrapper = ({ children }: { children: ReactNode }) => (
		<RepoSelectionContext.Provider
			value={{
				repos: order,
				selectedCwd: "/git/alpha",
				worktreeCwd: "/git/alpha",
				setSelectedCwd: vi.fn(),
				cloneOn: (cwd) => cwd,
				originOf: () => undefined,
			}}
		>
			{children}
		</RepoSelectionContext.Provider>
	);
	const { result, rerender } = renderHook(
		() => useDefaultNewSessionMode("/git/alpha", true),
		{ wrapper: reorderingWrapper },
	);

	order = [...repos].reverse();
	rerender();
	await act(async () => release());

	expect(result.current).toEqual({ mode: "prompt", pending: false });
	expect(fetch).toHaveBeenCalledTimes(1);
});

it("reloads the modes each time the dialog opens", async () => {
	stubModes({ "/git/alpha": "draft", "/git/beta": "draft" });
	const { result, rerender } = renderHook(
		({ open }) => useDefaultNewSessionMode("/git/alpha", open),
		{ wrapper, initialProps: { open: false } },
	);
	await act(async () => {});

	stubModes({ "/git/alpha": "prompt", "/git/beta": "draft" });
	rerender({ open: true });
	expect(result.current?.pending).toBe(true);

	await act(async () => {});
	expect(result.current).toEqual({ mode: "prompt", pending: false });
});

it("stays pending through a failed reload and retries until the server answers", async () => {
	vi.useFakeTimers();
	try {
		stubModes({ "/git/alpha": "draft" });
		const { result, rerender } = renderHook(
			({ open }) => useDefaultNewSessionMode("/git/alpha", open),
			{ wrapper, initialProps: { open: false } },
		);
		await act(async () => {});

		vi.stubGlobal(
			"fetch",
			vi.fn(async () => {
				throw new Error("offline");
			}),
		);
		rerender({ open: true });
		await act(async () => {});
		expect(result.current?.pending).toBe(true);

		stubModes({ "/git/alpha": "prompt" });
		await act(async () => {
			await vi.advanceTimersByTimeAsync(1000);
		});
		expect(result.current).toEqual({ mode: "prompt", pending: false });
	} finally {
		vi.useRealTimers();
	}
});
