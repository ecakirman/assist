// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { assistPopoverContent } from "./assistPopoverContent";

afterEach(cleanup);

function field(): HTMLTextAreaElement {
	return screen.getByLabelText("Instructions for assist");
}

describe("assistPopoverContent", () => {
	it("closes on blur even with instructions typed", () => {
		const dismiss = vi.fn();
		render(assistPopoverContent("instructions", { send: vi.fn(), dismiss }));
		fireEvent.change(field(), { target: { value: "Rebase first" } });
		fireEvent.blur(field());
		expect(dismiss).toHaveBeenCalledWith(false);
	});

	it("leaves Ctrl+C to the browser", () => {
		const writeText = vi.fn();
		Object.assign(navigator, { clipboard: { writeText } });
		render(
			assistPopoverContent("instructions", { send: vi.fn(), dismiss: vi.fn() }),
		);
		const event = fireEvent.keyDown(field(), { key: "c", ctrlKey: true });
		expect(event).toBe(true);
		expect(writeText).not.toHaveBeenCalled();
	});
});
