// @vitest-environment jsdom
import Alert from "@mui/material/Alert";
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toast } from "./Toast";
import { ToastStack } from "./ToastStack";

afterEach(cleanup);

function renderToasts(names: string[], onClose = vi.fn()) {
	render(
		<ToastStack>
			{names.map((name) => (
				<Toast key={name} open onClose={onClose}>
					<Alert onClose={onClose}>{name}</Alert>
				</Toast>
			))}
		</ToastStack>,
	);
	return onClose;
}

function clickAwayArmed() {
	return act(() => new Promise((resolve) => setTimeout(resolve, 0)));
}

describe("ToastStack", () => {
	it("renders every open toast inside the shared stack in open order", () => {
		renderToasts(["first", "second"]);

		const stack = screen.getByTestId("toast-stack");
		expect(stack.children).toHaveLength(2);
		expect(stack.textContent).toBe("firstsecond");
	});

	it("does not close the other toasts when one toast is clicked", async () => {
		const onClose = renderToasts(["first", "second"]);
		await clickAwayArmed();

		fireEvent.click(screen.getByText("first"));

		expect(onClose).not.toHaveBeenCalled();
	});

	it("still closes toasts on a click outside the stack", async () => {
		const onClose = renderToasts(["first"]);
		await clickAwayArmed();

		fireEvent.click(document.body);

		expect(onClose).toHaveBeenCalledWith(expect.anything(), "clickaway");
	});
});
