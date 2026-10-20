// @vitest-environment jsdom
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import type { ViewType } from "react-diff-view";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { HighLevelFileStatus } from "../../../../../../review/highLevel/types";
import { HighLevelNativeDiff } from "./HighLevelNativeDiff";
import { HighLevelHeadSourceProvider } from "./HighLevelReviewPane/HighLevelReviewBody/HighLevelHeadSourceProvider";

const line = (n: number) => `l${n};`;

function hunk(changed: number) {
	return [
		`@@ -${changed - 3},7 +${changed - 3},7 @@`,
		...[3, 2, 1].map((back) => ` ${line(changed - back)}`),
		`-${line(changed)}`,
		`+L${changed};`,
		...[1, 2, 3].map((ahead) => ` ${line(changed + ahead)}`),
	];
}

const patch = [...hunk(33), ...hunk(73)].join("\n");

const head = `${Array.from({ length: 100 }, (_, i) =>
	[33, 73].includes(i + 1) ? `L${i + 1};` : line(i + 1),
).join("\n")}\n`;

function respondWith(...responses: { status: number; body: object }[]) {
	const fetchMock = vi.fn();
	for (const { status, body } of responses)
		fetchMock.mockResolvedValueOnce(Response.json(body, { status }));
	vi.stubGlobal("fetch", fetchMock);
	return fetchMock;
}

function renderDiff(
	viewType: ViewType = "unified",
	status: HighLevelFileStatus = "modified",
) {
	return render(
		<HighLevelHeadSourceProvider repo="acme/app" headSha="abc1234">
			<HighLevelNativeDiff
				path="src/app.ts"
				status={status}
				patch={patch}
				viewType={viewType}
			/>
		</HighLevelHeadSourceProvider>,
	);
}

function shown(container: HTMLElement, n: number) {
	return [...container.querySelectorAll(".diff-code")].some(
		(cell) => cell.textContent === line(n),
	);
}

function click(name: string) {
	fireEvent.click(screen.getByRole("button", { name }));
}

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

describe("HighLevelNativeDiff stepped gap expansion", () => {
	it("expands the top gap upward only, 20 lines at a time", async () => {
		respondWith({ status: 200, body: { content: head } });
		const { container } = renderDiff();

		click("Show 20 lines above");

		await waitFor(() => expect(shown(container, 10)).toBe(true));
		expect(shown(container, 9)).toBe(false);
		expect(screen.getByText(/^9 hidden lines/)).toBeTruthy();
		click("Show 9 hidden lines");
		await waitFor(() => expect(shown(container, 1)).toBe(true));
	});

	it("reveals 20 lines from either side of a large gap until 20 or fewer remain", async () => {
		respondWith({ status: 200, body: { content: head } });
		const { container } = renderDiff();

		click("Show 20 lines below the previous change");

		await waitFor(() => expect(shown(container, 56)).toBe(true));
		expect(shown(container, 37)).toBe(true);
		expect(shown(container, 57)).toBe(false);
		expect(
			screen.queryByRole("button", {
				name: "Show 20 lines above the next change",
			}),
		).toBeNull();
		click("Show 13 hidden lines");
		await waitFor(() => expect(shown(container, 69)).toBe(true));
	});

	it("reveals 20 lines above the next change", async () => {
		respondWith({ status: 200, body: { content: head } });
		const { container } = renderDiff();

		click("Show 20 lines above the next change");

		await waitFor(() => expect(shown(container, 50)).toBe(true));
		expect(shown(container, 69)).toBe(true);
		expect(shown(container, 49)).toBe(false);
	});

	it("counts the bottom gap once the file has loaded and expands it downward", async () => {
		respondWith({ status: 200, body: { content: head } });
		const { container } = renderDiff();

		expect(screen.getByText(/More lines below/)).toBeTruthy();
		click("Show 20 lines above");
		await waitFor(() =>
			expect(screen.getByText(/^24 hidden lines/)).toBeTruthy(),
		);

		click("Show 20 lines below");
		await waitFor(() => expect(shown(container, 96)).toBe(true));
		expect(screen.getByText(/^4 hidden lines/)).toBeTruthy();
		click("Show 20 lines below");
		await waitFor(() => expect(shown(container, 100)).toBe(true));
		expect(screen.queryByRole("button", { name: /below$/ })).toBeNull();
	});

	it("retries in the direction that failed", async () => {
		respondWith(
			{ status: 502, body: { error: "gh: boom" } },
			{ status: 200, body: { content: head } },
		);
		const { container } = renderDiff();
		click("Show 20 lines above");
		await waitFor(() => expect(screen.getByText(/gh: boom/)).toBeTruthy());

		click("Retry");

		await waitFor(() => expect(shown(container, 10)).toBe(true));
		expect(shown(container, 9)).toBe(false);
	});

	it("steps through a large gap in split view", async () => {
		respondWith({ status: 200, body: { content: head } });
		const { container } = renderDiff("split");

		click("Show 20 lines above the next change");

		await waitFor(() => expect(shown(container, 50)).toBe(true));
		expect(shown(container, 49)).toBe(false);
	});

	it.each<HighLevelFileStatus>(["added", "removed"])(
		"shows no expanders for a %s file",
		(status) => {
			renderDiff("unified", status);

			expect(screen.queryByRole("button", { name: /^Show/ })).toBeNull();
		},
	);
});
