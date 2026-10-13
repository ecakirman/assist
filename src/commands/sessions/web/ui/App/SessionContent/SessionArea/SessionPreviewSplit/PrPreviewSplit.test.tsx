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
	it("fills the window with the high-level pane and returns to half", () => {
		const terminalWidth = renderSplit(preview());
		expect(terminalWidth()).toBe("50%");

		fireEvent.click(screen.getByLabelText("Fill the window with review"));
		expect(terminalWidth()).toBe("0%");
		expect(
			screen
				.getByLabelText("Show terminal beside review")
				.getAttribute("aria-pressed"),
		).toBe("true");

		fireEvent.click(screen.getByLabelText("Show terminal beside review"));
		expect(terminalWidth()).toBe("50%");
	});

	it("keeps other preview kinds at half with no toggle", () => {
		const terminalWidth = renderSplit(preview({ kind: "show", body: "hi" }));

		expect(terminalWidth()).toBe("50%");
		expect(screen.queryByLabelText("Fill the window with review")).toBeNull();
	});
});
