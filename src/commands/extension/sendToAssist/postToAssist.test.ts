import { afterEach, describe, expect, it, vi } from "vitest";
import { postToAssist } from "./postToAssist";

const SERVER = "http://localhost:3100";
const URL = "https://github.com/org/repo/pull/1#discussion_r2";
const message = { type: "assist-send" as const, url: URL };

function respond(status: number, body: unknown) {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue(Response.json(body, { status })),
	);
}

afterEach(() => vi.unstubAllGlobals());

describe("postToAssist", () => {
	it("posts the link to the from-github endpoint", async () => {
		respond(200, { sessionId: "s1", cwd: "/base/repo" });
		expect(await postToAssist(SERVER, message)).toEqual({
			ok: true,
			message: "assist session started in /base/repo",
		});
		expect(fetch).toHaveBeenCalledWith(
			`${SERVER}/api/sessions/from-github`,
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({ url: URL }),
			}),
		);
	});

	it("posts the mode to the from-github endpoint", async () => {
		respond(200, { sessionId: "s1", cwd: "/base/repo" });
		await postToAssist(SERVER, {
			...message,
			instructions: "go",
			mode: "draft",
		});
		expect(fetch).toHaveBeenCalledWith(
			`${SERVER}/api/sessions/from-github`,
			expect.objectContaining({
				body: JSON.stringify({ url: URL, instructions: "go", mode: "draft" }),
			}),
		);
	});

	it("posts args to the review-from-github endpoint", async () => {
		respond(200, { sessionId: "s1", cwd: "/base/repo" });
		const PR = "https://github.com/org/repo/pull/1";
		await postToAssist(SERVER, { ...message, url: PR, args: ["review"] });
		expect(fetch).toHaveBeenCalledWith(
			`${SERVER}/api/sessions/review-from-github`,
			expect.objectContaining({
				body: JSON.stringify({ url: PR, args: ["review"] }),
			}),
		);
	});

	it("relays the server's error", async () => {
		respond(404, { error: "org/repo is not cloned under /base" });
		expect(await postToAssist(SERVER, message)).toEqual({
			ok: false,
			message: "org/repo is not cloned under /base",
		});
	});

	it("names the server when it is unreachable", async () => {
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("down")));
		expect(await postToAssist(SERVER, message)).toEqual({
			ok: false,
			message: `assist web server unreachable at ${SERVER}`,
		});
	});
});
