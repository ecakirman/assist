// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CommentPopover } from "./CommentPopover";

afterEach(cleanup);

const pending = { quote: "const a = 1;", top: 120, left: 40 };

function renderPopover(unavailable?: string) {
	const onAdd = vi.fn();
	const onQueue = vi.fn();
	render(
		<CommentPopover
			pending={pending}
			cwd={undefined}
			path="src/a.ts"
			unavailable={unavailable}
			onAdd={onAdd}
			onQueue={onQueue}
			onAddRule={undefined}
			onCancel={vi.fn()}
		/>,
	);
	fireEvent.change(screen.getByPlaceholderText("Add a note…"), {
		target: { value: "  rename this  " },
	});
	return { onAdd, onQueue };
}

describe("CommentPopover with a review queue", () => {
	it("sends the note to the agent", () => {
		const { onAdd, onQueue } = renderPopover();

		fireEvent.click(screen.getByRole("button", { name: "Send to agent" }));

		expect(onAdd).toHaveBeenCalledWith("rename this");
		expect(onQueue).not.toHaveBeenCalled();
	});

	it("adds the note to the review", () => {
		const { onAdd, onQueue } = renderPopover();

		fireEvent.click(screen.getByRole("button", { name: "Add to review" }));

		expect(onQueue).toHaveBeenCalledWith("rename this");
		expect(onAdd).not.toHaveBeenCalled();
	});

	it("still queues when the agent is unavailable", () => {
		const { onQueue } = renderPopover("No live agent session");

		expect(screen.getByText("No live agent session")).toBeTruthy();
		expect(
			(
				screen.getByRole("button", {
					name: "Send to agent",
				}) as HTMLButtonElement
			).disabled,
		).toBe(true);
		fireEvent.click(screen.getByRole("button", { name: "Add to review" }));

		expect(onQueue).toHaveBeenCalledWith("rename this");
	});
});
