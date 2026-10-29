// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CompleteButton } from "./CompleteButton";

afterEach(cleanup);

describe("CompleteButton", () => {
	it("focuses the Mark done button when the dialog opens", () => {
		render(
			<CompleteButton
				target={{ itemId: 42, phase: 1, totalPhases: 1 }}
				onDismiss={() => {}}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: /done/i }));

		expect(document.activeElement).toBe(
			screen.getByRole("button", { name: "Mark done" }),
		);
	});
});
