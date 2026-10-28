// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { makeSessionInfo } from "../../../../../../test/mothers/makeSessionInfo";
import { groupCollapseStore } from "./useCollapsedGroups/groupCollapseStore";
import { useSidebarOrdering } from "./useSidebarOrdering";
import { StarredSessionsProvider } from "../useStarredSessions";

vi.mock("./useSidebarOrdering/useSessionViewConfig", () => ({
	useSessionViewConfig: () => ({
		floatWaiting: true,
		floatWaitingAfterMs: 0,
		parkWaitingAfterMs: 60_000,
	}),
}));

afterEach(() => {
	cleanup();
	localStorage.clear();
});

function Stars({ children }: { children: ReactNode }) {
	return (
		<StarredSessionsProvider sessions={[]} setSessionStarred={() => {}}>
			{children}
		</StarredSessionsProvider>
	);
}

const members = [
	makeSessionInfo({
		id: "a",
		status: "waiting",
		waitingSince: Date.now() - 120_000,
	}),
	makeSessionInfo({
		id: "b",
		status: "waiting",
		waitingSince: Date.now() - 120_000,
	}),
];

function renderParked(activeId: string | null = null) {
	const { result } = renderHook(() => useSidebarOrdering(members, activeId), {
		wrapper: Stars,
	});
	return () => result.current.isParkedGroup("/repo", members);
}

describe("useSidebarOrdering isParkedGroup", () => {
	it("parks a group whose members have all waited past the park threshold", () => {
		expect(renderParked()()).toBe(true);
	});

	it("does not park the group holding the active session", () => {
		expect(renderParked("a")()).toBe(false);
	});

	it("keeps a group the user opened out of the Parked section", () => {
		const isParked = renderParked();

		act(() => groupCollapseStore.setChoice("/repo", false));

		expect(isParked()).toBe(false);
	});

	it("keeps a group the user collapsed in place rather than parking it", () => {
		const isParked = renderParked();

		act(() => groupCollapseStore.setChoice("/repo", true));

		expect(isParked()).toBe(false);
	});
});
