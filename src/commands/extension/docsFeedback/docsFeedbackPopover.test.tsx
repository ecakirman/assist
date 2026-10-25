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

	it("closes on blur when the textbox is empty", () => {
		const dismiss = vi.fn();
		render(docsFeedbackPopover(vi.fn(), dismiss));
		fireEvent.blur(field());
		expect(dismiss).toHaveBeenCalledWith(false);
	});

	it("stays open on blur while feedback is typed", () => {
		const dismiss = vi.fn();
		render(docsFeedbackPopover(vi.fn(), dismiss));
		fireEvent.change(field(), { target: { value: "Pin the version" } });
		fireEvent.blur(field());
		expect(dismiss).not.toHaveBeenCalled();
		fireEvent.keyDown(field(), { key: "Escape" });
		expect(dismiss).toHaveBeenCalledWith(true);
	});

	it("copies the selected text when the textbox is empty", () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.assign(navigator, { clipboard: { writeText } });
		const dismiss = vi.fn();
		render(
			docsFeedbackPopover(vi.fn(), dismiss, { selectedText: "npm install" }),
		);
		fireEvent.keyDown(field(), { key: "c", ctrlKey: true });
		fireEvent.keyDown(field(), { key: "c", metaKey: true });
		expect(writeText).toHaveBeenCalledTimes(2);
		expect(writeText).toHaveBeenCalledWith("npm install");
		fireEvent.change(field(), { target: { value: "Pin" } });
		fireEvent.keyDown(field(), { key: "c", ctrlKey: true });
		expect(writeText).toHaveBeenCalledTimes(2);
		expect(dismiss).not.toHaveBeenCalled();
	});
});
