// @vitest-environment jsdom
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiNodeContext } from "../../../../sessions/web/ui/useApiNode";
import {
	RepoSelectionContext,
	type RepoSelection,
} from "../../../../sessions/web/ui/useRepoSelectionContext";
import { SessionLaunchContext } from "../../../../sessions/web/ui/useSessionLaunchContext";

const updateItemStatus = vi.fn();
vi.mock("../api", () => ({
	updateItemStatus: (...args: unknown[]) => updateItemStatus(...args),
}));

import { PlayAction } from "./PlayAction";

const repoSelection: RepoSelection = {
	repos: [],
	selectedCwd: "/repo",
	worktreeCwd: "",
	setSelectedCwd: () => {},
	cloneOn: (cwd) => cwd,
	originOf: () => undefined,
};

function renderCompact({
	launchAssist = vi.fn(),
	onMarkedDone = vi.fn(() => Promise.resolve()),
	onCardClick = vi.fn(),
} = {}) {
	render(
		<MemoryRouter initialEntries={["/backlog"]}>
			<RepoSelectionContext.Provider value={repoSelection}>
				<ApiNodeContext.Provider value="peer">
					<SessionLaunchContext.Provider
						value={{
							launchAssist,
							launchAgentInStream: () => {},
							resumeSession: () => {},
							armUpdateReload: () => {},
							activateSession: () => {},
							sendInput: () => {},
						}}
					>
						<div onClick={onCardClick}>
							<PlayAction
								itemId={775}
								compact={{ currentPhase: 2, totalPhases: 3, onMarkedDone }}
							/>
						</div>
					</SessionLaunchContext.Provider>
				</ApiNodeContext.Provider>
			</RepoSelectionContext.Provider>
		</MemoryRouter>,
	);
	return { launchAssist, onMarkedDone, onCardClick };
}

function openMarkDone() {
	fireEvent.click(screen.getByRole("button", { name: "More actions" }));
	fireEvent.click(screen.getByRole("menuitem", { name: "Mark done" }));
}

beforeEach(() => {
	updateItemStatus.mockReset();
});
afterEach(cleanup);

describe("compact play split button", () => {
	it("still launches a build from the play segment without opening the card", () => {
		const { launchAssist, onCardClick } = renderCompact();

		fireEvent.click(screen.getByRole("button", { name: "Build" }));

		expect(launchAssist).toHaveBeenCalledWith(
			["backlog", "run", "a775"],
			"/repo",
		);
		expect(onCardClick).not.toHaveBeenCalled();
	});

	it("joins the dropdown to the play segment", () => {
		renderCompact();

		expect(
			screen
				.getByRole("button", { name: "More actions" })
				.closest(".MuiButtonGroup-root"),
		).toBe(
			screen
				.getByRole("button", { name: "Build" })
				.closest(".MuiButtonGroup-root"),
		);
	});

	it("offers only Mark done in the dropdown", () => {
		renderCompact();

		fireEvent.click(screen.getByRole("button", { name: "More actions" }));

		expect(
			screen.getAllByRole("menuitem").map((item) => item.textContent),
		).toEqual(["Mark done"]);
	});

	it("confirms with the phase count before marking done", () => {
		const { onCardClick } = renderCompact();

		openMarkDone();

		const dialog = screen.getByRole("dialog");
		expect(dialog.textContent).toContain("Mark a775 done");
		expect(dialog.textContent).toContain(
			"2 of 3 phases completed. Mark this backlog item as done?",
		);
		expect(screen.getByRole("button", { name: "Mark done" })).toBeTruthy();
		expect(onCardClick).not.toHaveBeenCalled();
	});

	it("leaves the item alone when cancelled", async () => {
		const { onMarkedDone, onCardClick } = renderCompact();

		openMarkDone();
		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
		expect(updateItemStatus).not.toHaveBeenCalled();
		expect(onMarkedDone).not.toHaveBeenCalled();
		expect(onCardClick).not.toHaveBeenCalled();
	});

	it("marks the item done in the repo and node, then reloads", async () => {
		updateItemStatus.mockResolvedValue({});
		const { onMarkedDone, onCardClick } = renderCompact();

		openMarkDone();
		fireEvent.click(screen.getByRole("button", { name: "Mark done" }));

		await waitFor(() => expect(onMarkedDone).toHaveBeenCalled());
		expect(updateItemStatus).toHaveBeenCalledWith(775, "done", "/repo", "peer");
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
		expect(onCardClick).not.toHaveBeenCalled();
	});

	it("shows an error and keeps the dialog usable when the update fails", async () => {
		updateItemStatus.mockRejectedValue(new Error("boom"));
		const { onMarkedDone } = renderCompact();

		openMarkDone();
		fireEvent.click(screen.getByRole("button", { name: "Mark done" }));

		expect(
			await screen.findByText("Failed to mark item a775 as done"),
		).toBeTruthy();
		const confirm = screen.getByRole("button", { name: "Mark done" });
		expect((confirm as HTMLButtonElement).disabled).toBe(false);
		expect(onMarkedDone).not.toHaveBeenCalled();
	});
});
