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
import { HighLevelNativeDiff } from "./HighLevelNativeDiff";
import { HighLevelHeadSourceProvider } from "./HighLevelReviewPane/HighLevelReviewBody/HighLevelHeadSourceProvider";

const patch = [
	"@@ -1,3 +1,4 @@",
	" const a = 1;",
	"+const added = 0;",
	" const b = 2;",
	" const c = 3;",
	"@@ -10,2 +11,2 @@",
	" const j = 10;",
	"-const k = 11;",
	"+const K = 11;",
	"@@ -20,1 +21,1 @@",
	"-const t = 20;",
	"+const T = 20;",
].join("\n");

const head = [
	"const a = 1;",
	"const added = 0;",
	"const b = 2;",
	"const c = 3;",
	...["d", "e", "f", "g", "h", "i"].map((name) => `const ${name} = 0;`),
	"const j = 10;",
	"const K = 11;",
	...Array.from({ length: 8 }, (_, i) => `const gap${i} = 0;`),
	"const T = 20;",
	"",
].join("\n");

function respondWith(...responses: { status: number; body: object }[]) {
	const fetchMock = vi.fn();
	for (const { status, body } of responses)
		fetchMock.mockResolvedValueOnce(Response.json(body, { status }));
	vi.stubGlobal("fetch", fetchMock);
	return fetchMock;
}

function renderDiff(viewType: ViewType = "unified") {
	return render(
		<HighLevelHeadSourceProvider repo="acme/app" headSha="abc1234">
			<HighLevelNativeDiff
				path="src/app.ts"
				status="modified"
				patch={patch}
				viewType={viewType}
			/>
		</HighLevelHeadSourceProvider>,
	);
}

function rowWithText(container: HTMLElement, text: string) {
	return [...container.querySelectorAll("tr")].find((row) =>
		row.textContent?.includes(text),
	);
}

function gutterNumbers(row: HTMLTableRowElement | undefined) {
	return [...(row?.querySelectorAll(".diff-gutter") ?? [])].map(
		(cell) => cell.textContent,
	);
}

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

describe("HighLevelNativeDiff gap expansion", () => {
	it("puts an expander in each gap between hunks", () => {
		renderDiff();

		expect(
			screen.getByRole("button", { name: "Show 6 hidden lines" }),
		).toBeTruthy();
		expect(
			screen.getByRole("button", { name: "Show 8 hidden lines" }),
		).toBeTruthy();
	});

	it("shows no expanders without a PR head to read from", () => {
		render(
			<HighLevelNativeDiff
				path="src/app.ts"
				status="modified"
				patch={patch}
				viewType="unified"
			/>,
		);

		expect(screen.queryByRole("button", { name: /hidden lines/ })).toBeNull();
	});

	it.each(["added", "removed"] as const)(
		"shows no expanders for a %s file",
		(status) => {
			render(
				<HighLevelHeadSourceProvider repo="acme/app" headSha="abc1234">
					<HighLevelNativeDiff
						path="src/app.ts"
						status={status}
						patch={patch}
						viewType="unified"
					/>
				</HighLevelHeadSourceProvider>,
			);

			expect(screen.queryByRole("button", { name: /^Show / })).toBeNull();
		},
	);

	it("fetches the file at the PR head and reveals the gap with both line numbers", async () => {
		const fetchMock = respondWith({ status: 200, body: { content: head } });
		const { container } = renderDiff();

		fireEvent.click(
			screen.getByRole("button", { name: "Show 6 hidden lines" }),
		);

		await waitFor(() =>
			expect(rowWithText(container, "const d = 0;")).toBeTruthy(),
		);
		expect(gutterNumbers(rowWithText(container, "const d = 0;"))).toEqual([
			"4",
			"5",
		]);
		expect(gutterNumbers(rowWithText(container, "const i = 0;"))).toEqual([
			"9",
			"10",
		]);
		expect(
			screen.queryByRole("button", { name: "Show 6 hidden lines" }),
		).toBeNull();
		expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
			"/api/github-file?repo=acme%2Fapp&sha=abc1234&path=src%2Fapp.ts",
		);
	});

	it("highlights the revealed lines", async () => {
		respondWith({ status: 200, body: { content: head } });
		const { container } = renderDiff();

		fireEvent.click(
			screen.getByRole("button", { name: "Show 6 hidden lines" }),
		);

		await waitFor(() =>
			expect(
				rowWithText(container, "const d = 0;")?.querySelector(".token"),
			).toBeTruthy(),
		);
	});

	it("reuses the fetched file for later gaps", async () => {
		const fetchMock = respondWith({ status: 200, body: { content: head } });
		const { container } = renderDiff();

		fireEvent.click(
			screen.getByRole("button", { name: "Show 6 hidden lines" }),
		);
		await waitFor(() =>
			expect(rowWithText(container, "const d = 0;")).toBeTruthy(),
		);
		fireEvent.click(
			screen.getByRole("button", { name: "Show 8 hidden lines" }),
		);
		await waitFor(() =>
			expect(rowWithText(container, "const gap0 = 0;")).toBeTruthy(),
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("disables every expander and shows a spinner on the clicked row while loading", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(() => new Promise(() => {})),
		);
		renderDiff();

		fireEvent.click(
			screen.getByRole("button", { name: "Show 8 hidden lines" }),
		);

		await waitFor(() => expect(screen.getByLabelText("Loading")).toBeTruthy());
		for (const button of screen.getAllByRole("button", {
			name: /hidden lines/,
		}))
			expect((button as HTMLButtonElement).disabled).toBe(true);
		expect(
			screen
				.getByLabelText("Loading")
				.closest("tr")
				?.querySelector("[aria-label='Show 8 hidden lines']"),
		).toBeTruthy();
	});

	it("shows why the fetch failed and retries on request", async () => {
		const fetchMock = respondWith(
			{ status: 502, body: { error: "gh: Not Found (HTTP 404)" } },
			{ status: 200, body: { content: head } },
		);
		const { container } = renderDiff();

		fireEvent.click(
			screen.getByRole("button", { name: "Show 6 hidden lines" }),
		);
		await waitFor(() =>
			expect(screen.getByText(/gh: Not Found \(HTTP 404\)/)).toBeTruthy(),
		);
		fireEvent.click(screen.getByRole("button", { name: "Retry" }));

		await waitFor(() =>
			expect(rowWithText(container, "const d = 0;")).toBeTruthy(),
		);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it("reveals the gap in split view", async () => {
		respondWith({ status: 200, body: { content: head } });
		const { container } = renderDiff("split");

		fireEvent.click(
			screen.getByRole("button", { name: "Show 6 hidden lines" }),
		);

		await waitFor(() =>
			expect(rowWithText(container, "const d = 0;")).toBeTruthy(),
		);
		expect(gutterNumbers(rowWithText(container, "const d = 0;"))).toEqual([
			"4",
			"5",
		]);
	});
});
