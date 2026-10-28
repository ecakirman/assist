// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isFocusHeld } from "../../../holdFocus";
import type { PendingLaunch } from "../../../../PendingLaunch";
import { SessionList } from "./SessionList";
import type { SessionInfo } from "../../../../types";
import { StarredSessionsProvider } from "../../../useStarredSessions";
import { makeSessionInfo } from "../../../../../../../../test/mothers/makeSessionInfo";

let frames: FrameRequestCallback[] = [];

beforeEach(() => {
	frames = [];
	vi.stubGlobal("requestAnimationFrame", (frame: FrameRequestCallback) => {
		frames.push(frame);
		return frames.length;
	});
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
	localStorage.clear();
});

const group = { origin: "host/org/assist", clone: "/git/assist" };

function List({
	sessions,
	onSelect,
	pendingLaunches = [],
	isParkedGroup,
}: {
	sessions: SessionInfo[];
	onSelect: (id: string) => void;
	pendingLaunches?: PendingLaunch[];
	isParkedGroup?: (key: string) => boolean;
}) {
	const [activeId, setActiveId] = useState<string | null>(
		sessions[0]?.id ?? null,
	);
	return (
		<StarredSessionsProvider sessions={[]} setSessionStarred={() => {}}>
			<SessionList
				sessions={sessions}
				pendingLaunches={pendingLaunches}
				activeId={activeId}
				initialized={new Set(sessions.map((s) => s.id))}
				onSelect={(id) => {
					setActiveId(id);
					onSelect(id);
				}}
				onDismissPending={() => {}}
				onRetry={() => {}}
				onRestart={() => {}}
				onDismiss={() => {}}
				onSetAutoApprove={() => {}}
				onSetAutoAdvance={() => {}}
				isParkedGroup={isParkedGroup}
			/>
		</StarredSessionsProvider>
	);
}

function card(id: string) {
	return document.querySelector<HTMLElement>(`[data-session-id="${id}"]`)!;
}

function renderCycling() {
	const onSelect = vi.fn();
	render(
		<List
			sessions={[
				makeSessionInfo({ id: "a" }),
				makeSessionInfo({ id: "b" }),
				makeSessionInfo({ id: "c" }),
			]}
			onSelect={onSelect}
		/>,
	);
	for (const id of ["a", "b", "c"]) card(id).scrollIntoView = vi.fn();
	card("a").focus();
	return onSelect;
}

function pressTab(shiftKey = false) {
	const notCancelled = fireEvent.keyDown(document.activeElement!, {
		key: "Tab",
		shiftKey,
	});
	for (const frame of frames.splice(0)) frame(0);
	return notCancelled;
}

describe("SessionList scroll area", () => {
	it("scrolls without vertical padding so sticky group headers stop at its top edge", () => {
		const { container } = render(<List sessions={[]} onSelect={() => {}} />);
		const scrollport = container.firstElementChild as HTMLElement;

		expect(getComputedStyle(scrollport).overflow).toBe("auto");
		expect(getComputedStyle(scrollport).paddingTop).toBe("0");
	});
});

function groupToggle() {
	return document.querySelector<HTMLElement>("[aria-expanded]")!;
}

function renderGroupedList(
	onSelect = vi.fn(),
	isParkedGroup?: (key: string) => boolean,
) {
	render(
		<List
			sessions={[
				makeSessionInfo({ id: "solo", cwd: "/git/solo", status: "waiting" }),
				makeSessionInfo({
					id: "g1",
					cwd: "/git/assist-2",
					repoGroup: group,
					status: "waiting",
				}),
				makeSessionInfo({
					id: "g2",
					cwd: "/git/assist-3",
					repoGroup: group,
					status: "running",
				}),
				makeSessionInfo({ id: "last", cwd: "/git/other" }),
			]}
			onSelect={onSelect}
			isParkedGroup={isParkedGroup}
		/>,
	);
	for (const id of ["solo", "g1", "g2", "last"])
		if (card(id)) card(id).scrollIntoView = vi.fn();
	return onSelect;
}

describe("SessionList repo group collapse", () => {
	it("collapses a group on header click and opens it again", () => {
		renderGroupedList();

		fireEvent.click(groupToggle());

		expect(groupToggle().getAttribute("aria-expanded")).toBe("false");
		expect(card("g1")).toBeNull();
		expect(card("g2")).toBeNull();

		fireEvent.click(groupToggle());

		expect(groupToggle().getAttribute("aria-expanded")).toBe("true");
		expect(card("g1")).not.toBeNull();
	});

	it("shows a per-status tally with card glyphs while collapsed", () => {
		renderGroupedList();

		fireEvent.click(groupToggle());

		expect(groupToggle().textContent).toContain("◆ 1 waiting");
		expect(groupToggle().textContent).toContain("● 1 running");
	});

	it("remembers a collapsed group across a remount", () => {
		renderGroupedList();
		fireEvent.click(groupToggle());
		cleanup();

		renderGroupedList();

		expect(groupToggle().getAttribute("aria-expanded")).toBe("false");
		expect(card("g1")).toBeNull();
	});

	it("opens a collapsed group when a new session joins it", () => {
		const members = [
			makeSessionInfo({ id: "g1", cwd: "/git/assist-2", repoGroup: group }),
			makeSessionInfo({ id: "g2", cwd: "/git/assist-3", repoGroup: group }),
		];
		const { rerender } = render(<List sessions={members} onSelect={vi.fn()} />);
		fireEvent.click(groupToggle());

		rerender(
			<List
				sessions={[
					...members,
					makeSessionInfo({
						id: "g3",
						cwd: "/git/assist-4",
						repoGroup: group,
						startedAt: Date.now() + 1000,
					}),
				]}
				onSelect={vi.fn()}
			/>,
		);

		expect(groupToggle().getAttribute("aria-expanded")).toBe("true");
		expect(card("g3")).not.toBeNull();
	});

	it("skips sessions in a collapsed group when Tab cycling", () => {
		const onSelect = renderGroupedList();
		fireEvent.click(groupToggle());
		card("solo").focus();

		pressTab();

		expect(onSelect).toHaveBeenLastCalledWith("last");
	});
});

describe("SessionList parked groups", () => {
	const parked = (key: string) => key === group.origin;

	function renderedOrder() {
		return [
			...document.querySelectorAll(
				"[data-session-id], [data-testid=parked-divider], [aria-expanded]",
			),
		].map(
			(el) =>
				el.getAttribute("data-session-id") ??
				el.getAttribute("data-testid") ??
				"group",
		);
	}

	it("renders a parked group collapsed below a Parked divider at the bottom", () => {
		renderGroupedList(vi.fn(), parked);

		expect(groupToggle().getAttribute("aria-expanded")).toBe("false");
		expect(renderedOrder()).toEqual([
			"solo",
			"last",
			"parked-divider",
			"group",
		]);
	});

	it("omits the divider when nothing is parked", () => {
		renderGroupedList();

		expect(screen.queryByTestId("parked-divider")).toBeNull();
	});

	it("skips sessions in a parked group when Tab cycling", () => {
		const onSelect = renderGroupedList(vi.fn(), parked);
		card("solo").focus();

		pressTab();

		expect(onSelect).toHaveBeenLastCalledWith("last");
	});

	it("records when a parked group is opened so its park timer restarts", () => {
		vi.spyOn(Date, "now").mockReturnValue(42_000);
		renderGroupedList(vi.fn(), parked);

		fireEvent.click(groupToggle());

		expect(JSON.parse(localStorage.getItem("assist:group-collapse")!)).toEqual({
			[group.origin]: { openedAt: 42_000 },
		});
		vi.restoreAllMocks();
	});

	it("shows the pushpin only on a group the user collapsed", () => {
		renderGroupedList(vi.fn(), parked);
		expect(screen.queryByTestId("group-pinned")).toBeNull();
		cleanup();

		renderGroupedList();
		fireEvent.click(groupToggle());

		expect(screen.getByTestId("group-pinned")).not.toBeNull();
	});
});

describe("SessionList Tab cycling", () => {
	it("selects, focuses and scrolls to the next card on Tab", () => {
		const onSelect = renderCycling();

		expect(pressTab()).toBe(false);

		expect(onSelect).toHaveBeenLastCalledWith("b");
		expect(document.activeElement).toBe(card("b"));
		expect(card("b").scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
	});

	it("selects the previous card on Shift+Tab, wrapping to the last", () => {
		const onSelect = renderCycling();

		pressTab(true);

		expect(onSelect).toHaveBeenLastCalledWith("c");
		expect(document.activeElement).toBe(card("c"));
	});

	it("keeps cycling on repeated Tab and wraps back to the first card", () => {
		const onSelect = renderCycling();

		pressTab();
		pressTab();
		pressTab();

		expect(onSelect.mock.calls.map(([id]) => id)).toEqual(["b", "c", "a"]);
		expect(document.activeElement).toBe(card("a"));
		expect(isFocusHeld()).toBe(true);
	});

	it("switches card when Tab comes from a button inside a card", () => {
		const onSelect = renderCycling();
		const inner = card("b").querySelector<HTMLElement>("button")!;
		inner.focus();

		pressTab();

		expect(onSelect).toHaveBeenLastCalledWith("c");
		expect(document.activeElement).toBe(card("c"));
	});

	it("skips pending-launch placeholders and leaves Tab on them native", () => {
		const onSelect = vi.fn();
		render(
			<List
				sessions={[makeSessionInfo({ id: "a" }), makeSessionInfo({ id: "b" })]}
				pendingLaunches={[
					{ id: "p", title: "pending", status: "launching", startedAt: 0 },
				]}
				onSelect={onSelect}
			/>,
		);
		card("b").scrollIntoView = vi.fn();
		card("a").scrollIntoView = vi.fn();
		card("b").focus();

		pressTab();
		expect(onSelect).toHaveBeenLastCalledWith("a");

		onSelect.mockClear();
		screen.getByTitle("Dismiss").focus();
		expect(pressTab()).toBe(true);
		expect(onSelect).not.toHaveBeenCalled();
	});

	it("steps through a backlog run's nested children in visible order", () => {
		const onSelect = vi.fn();
		render(
			<List
				sessions={[
					makeSessionInfo({
						id: "run",
						cwd: "/git/assist-2",
						repoGroup: group,
						activity: { kind: "backlog", startedAt: 0 },
					}),
					makeSessionInfo({
						id: "other",
						cwd: "/git/assist-3",
						repoGroup: group,
					}),
					makeSessionInfo({
						id: "child",
						cwd: "/git/assist-2",
						repoGroup: group,
					}),
				]}
				onSelect={onSelect}
			/>,
		);
		for (const id of ["run", "other", "child"])
			card(id).scrollIntoView = vi.fn();
		card("run").focus();

		pressTab();
		pressTab();
		pressTab();

		expect(onSelect.mock.calls.map(([id]) => id)).toEqual([
			"child",
			"other",
			"run",
		]);
	});

	it("leaves Tab native when there is only one card", () => {
		const onSelect = vi.fn();
		render(
			<List sessions={[makeSessionInfo({ id: "a" })]} onSelect={onSelect} />,
		);
		card("a").focus();

		expect(pressTab()).toBe(true);
		expect(pressTab(true)).toBe(true);
		expect(onSelect).not.toHaveBeenCalled();
	});

	it("leaves Tab native outside the cards", () => {
		const onSelect = vi.fn();
		render(
			<>
				<input aria-label="filter" />
				<div data-testid="terminal" tabIndex={0} />
				<List
					sessions={[
						makeSessionInfo({ id: "a" }),
						makeSessionInfo({ id: "b" }),
					]}
					onSelect={onSelect}
				/>
			</>,
		);

		screen.getByLabelText("filter").focus();
		expect(pressTab()).toBe(true);
		screen.getByTestId("terminal").focus();
		expect(pressTab()).toBe(true);
		expect(onSelect).not.toHaveBeenCalled();
	});

	it("releases the focus hold once focus leaves the card", () => {
		renderCycling();
		pressTab();

		card("b").blur();

		expect(isFocusHeld()).toBe(false);
	});

	it("leaves Tab with other modifiers alone", () => {
		const onSelect = renderCycling();

		fireEvent.keyDown(card("a"), { key: "Tab", ctrlKey: true });

		expect(onSelect).not.toHaveBeenCalled();
	});
});
