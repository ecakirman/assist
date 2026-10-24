import type { IncomingMessage, ServerResponse } from "node:http";
import { Readable } from "node:stream";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { requestDaemonReply } from "../../daemon/requestDaemonReply";
import { docsFeedback } from "./docsFeedback";

vi.mock("../../daemon/requestDaemonReply", () => ({
	requestDaemonReply: vi.fn(),
}));

const requestDaemonReplyMock = vi.mocked(requestDaemonReply);

const feedback = {
	sessionId: "s3",
	pageId: "getting-started",
	heading: "Install",
	source: "docs/guide/pages/getting-started.json",
	selection: "npm install -g",
	prompt: "Mention the Node version",
};

async function post(body: unknown) {
	const req = Object.assign(
		Readable.from([Buffer.from(JSON.stringify(body))]),
		{
			headers: { origin: "moz-extension://abc" },
		},
	) as unknown as IncomingMessage;
	const headers: Record<string, string> = {};
	let status = 0;
	let text = "";
	const res = {
		setHeader: (name: string, value: string) => {
			headers[name] = value;
		},
		writeHead: (code: number) => {
			status = code;
		},
		end: (chunk?: string) => {
			text = chunk ?? "";
		},
	} as unknown as ServerResponse;
	await docsFeedback(req, res);
	return { status, body: JSON.parse(text), headers };
}

describe("docsFeedback", () => {
	beforeEach(() => vi.clearAllMocks());

	it("types the feedback into the docs session as a prompt", async () => {
		requestDaemonReplyMock.mockResolvedValue({
			ok: true,
			message: "Sent to assist session s3",
		});
		const { status, body, headers } = await post(feedback);
		expect(status).toBe(200);
		expect(body).toEqual({ message: "Sent to assist session s3" });
		expect(headers["Access-Control-Allow-Origin"]).toBe("moz-extension://abc");
		expect(requestDaemonReplyMock).toHaveBeenCalledWith(
			{
				type: "type-prompt",
				sessionId: "s3",
				text: expect.stringContaining("> npm install -g"),
			},
			"type-prompt-result",
		);
	});

	it("reports a missing or ended session", async () => {
		requestDaemonReplyMock.mockResolvedValue({
			ok: false,
			message: "assist session s3 has ended",
		});
		expect(await post(feedback)).toMatchObject({
			status: 404,
			body: { error: "assist session s3 has ended" },
		});
	});

	it("refuses a preview that was not started from a session", async () => {
		const { sessionId: _sessionId, ...rest } = feedback;
		expect(await post(rest)).toMatchObject({
			status: 404,
			body: {
				error: "This docs preview was not started from an assist session",
			},
		});
		expect(requestDaemonReplyMock).not.toHaveBeenCalled();
	});

	it("rejects a body without a prompt", async () => {
		expect((await post({ ...feedback, prompt: " " })).status).toBe(400);
	});

	it("reports a daemon that does not answer", async () => {
		requestDaemonReplyMock.mockResolvedValue(undefined);
		expect((await post(feedback)).status).toBe(504);
	});
});
