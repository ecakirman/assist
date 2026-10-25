// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { docsFeedbackPopover } from "./docsFeedbackPopover";

afterEach(cleanup);

function field(): HTMLTextAreaElement {
	return screen.getByLabelText("Instructions for assist");
}

function submit(text: string) {
	fireEvent.change(field(), { target: { value: text } });
	fireEvent.keyDown(field(), { key: "Enter" });
}

describe("docsFeedbackPopover", () => {
	it("keeps the typed feedback and shows why when sending fails", async () => {
		const send = vi.fn().mockResolvedValue({
			ok: false,
			message: "assist daemon did not answer",
		});
		const dismiss = vi.fn();
		render(docsFeedbackPopover(send, dismiss));
		submit("Pin the version");

		expect((await screen.findByRole("alert")).textContent).toContain(
			"assist daemon did not answer",
		);
		expect(field().value).toBe("Pin the version");
		expect(dismiss).not.toHaveBeenCalled();
		fireEvent.blur(field());
		expect(dismiss).not.toHaveBeenCalled();
	});

	it("retries with the kept text and closes once sent", async () => {
		const send = vi
			.fn()
			.mockResolvedValueOnce({ ok: false, message: "refused" })
			.mockResolvedValueOnce({ ok: true, message: "Sent" });
		const dismiss = vi.fn();
		render(docsFeedbackPopover(send, dismiss));
		submit("Pin the version");
		await screen.findByRole("alert");
		fireEvent.keyDown(field(), { key: "Enter" });

		await vi.waitFor(() => expect(dismiss).toHaveBeenCalledWith(false));
		expect(send).toHaveBeenLastCalledWith("Pin the version");
	});

	it("reopens with feedback that was not sent", () => {
		render(docsFeedbackPopover(vi.fn(), vi.fn(), "Pin the version"));
		expect(field().value).toBe("Pin the version");
	});
});
