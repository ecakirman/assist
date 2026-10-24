import { afterEach, describe, expect, it, vi } from "vitest";
import { isDocsFeedbackMessage } from "./isDocsFeedbackMessage";
import { postDocsFeedback } from "./postDocsFeedback";

const SERVER = "http://localhost:3100";
const feedback = {
	sessionId: "s9",
	pageId: "start",
	heading: "Install",
	source: "docs/guide/pages/start.json",
	selection: "npm install",
	prompt: "Pin the version",
};
const message = { type: "assist-docs-feedback" as const, ...feedback };

function respond(status: number, body: unknown) {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue(Response.json(body, { status })),
	);
}

afterEach(() => vi.unstubAllGlobals());

describe("postDocsFeedback", () => {
	it("posts the feedback without the message type", async () => {
		respond(200, { message: "Sent to assist session s9" });
		expect(await postDocsFeedback(SERVER, message)).toEqual({
			ok: true,
			message: "Sent to assist session s9",
		});
		expect(fetch).toHaveBeenCalledWith(
			`${SERVER}/api/sessions/docs-feedback`,
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify(feedback),
			}),
		);
	});

	it("relays a missing or ended session", async () => {
		respond(404, { error: "assist session s9 has ended" });
		expect(await postDocsFeedback(SERVER, message)).toEqual({
			ok: false,
			message: "assist session s9 has ended",
		});
	});
});

describe("isDocsFeedbackMessage", () => {
	it("recognises docs feedback and nothing else", () => {
		expect(isDocsFeedbackMessage(message)).toBe(true);
		expect(isDocsFeedbackMessage({ type: "assist-send", url: "x" })).toBe(
			false,
		);
		expect(isDocsFeedbackMessage(undefined)).toBe(false);
	});
});
