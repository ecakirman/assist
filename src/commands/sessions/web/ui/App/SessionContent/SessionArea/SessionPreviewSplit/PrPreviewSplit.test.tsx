// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PrPreview } from "../../../../../../shared/SessionInfoBase";
import { PrPreviewSplit } from "./PrPreviewSplit";

function preview(overrides: Partial<PrPreview> = {}): PrPreview {
	return {
		requestId: "req-1",
		title: "org/repo#42 — Review",
		body: "not json",
		prNumber: 42,
		kind: "high-level-review",
		...overrides,
	};
}

function renderSplit(value: PrPreview) {
	render(
		<PrPreviewSplit preview={value} onDecision={vi.fn()}>
			<div data-testid="terminal" />
		</PrPreviewSplit>,
	);
	const terminal = screen.getByTestId("terminal").parentElement as HTMLElement;
	return () => getComputedStyle(terminal).width;
}

afterEach(cleanup);

describe("PrPreviewSplit", () => {
	it.each([
		["high-level-review", preview()],
		["show", preview({ kind: "show", body: "hi" })],
		["ask", preview({ kind: "ask", body: "## Plan", prNumber: null })],
	])("fills the window with the %s pane and returns to half", (_, value) => {
		const terminalWidth = renderSplit(value);
		expect(terminalWidth()).toBe("50%");

		fireEvent.click(screen.getByLabelText("Fill the window with preview"));
		expect(terminalWidth()).toBe("0%");
		expect(
			screen
				.getByLabelText("Show terminal beside preview")
				.getAttribute("aria-pressed"),
		).toBe("true");

		fireEvent.click(screen.getByLabelText("Show terminal beside preview"));
		expect(terminalWidth()).toBe("50%");
	});

	it("stacks a show over the review and keeps the review mounted", () => {
		const onDecision = vi.fn();
		const review = preview();
		const show = preview({
			requestId: "show-1",
			kind: "show",
			title: "Stacked",
			body: "hello",
		});
		const tree = (stackedShow?: PrPreview) => (
			<PrPreviewSplit
				preview={review}
				stackedShow={stackedShow}
				onDecision={onDecision}
			>
				<div />
			</PrPreviewSplit>
		);
		const { rerender } = render(tree());
		const toggle = screen.getByLabelText("Fill the window with preview");

		rerender(tree(show));
		expect(screen.getByText("hello")).toBeTruthy();
		fireEvent.click(screen.getAllByText("Close").at(-1) as HTMLElement);
		expect(onDecision).toHaveBeenCalledWith(
			"show-1",
			"reject",
			expect.anything(),
		);

		rerender(tree());
		expect(screen.queryByText("hello")).toBeNull();
		expect(screen.getByLabelText("Fill the window with preview")).toBe(toggle);
	});
});
