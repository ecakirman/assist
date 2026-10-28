// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CommentNoteForm } from "./CommentNoteForm";

afterEach(cleanup);

function renderForm() {
	render(
		<CommentNoteForm
			onAdd={vi.fn()}
			onQueue={vi.fn()}
			onAddRule={vi.fn()}
			onCancel={vi.fn()}
			onCollapse={vi.fn()}
		/>,
	);
	fireEvent.change(screen.getByPlaceholderText("Add a note…"), {
		target: { value: "rename this" },
	});
}

function buttonsAfterNote(): string[] {
	const note = screen.getByPlaceholderText("Add a note…");
	return screen
		.getAllByRole("button")
		.filter(
			(button) =>
				note.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING,
		)
		.map((button) => button.textContent ?? "");
}

describe("CommentNoteForm actions", () => {
	it("orders the actions primary first for Tab from the note", () => {
		renderForm();

		expect(buttonsAfterNote()).toEqual([
			"Send to agent",
			"Add to review",
			"Add rule",
			"Collapse",
			"Cancel",
		]);
	});

	it("reverses the row so the primary stays rightmost", () => {
		renderForm();

		const row = screen.getByRole("button", { name: "Cancel" }).parentElement;

		expect(row && getComputedStyle(row).flexDirection).toBe("row-reverse");
	});
});
