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
});
