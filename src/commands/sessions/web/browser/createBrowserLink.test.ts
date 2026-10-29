import { EventEmitter } from "node:events";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createBrowserLink, type LinkSocket } from "./createBrowserLink";

class FakeSocket extends EventEmitter {
	sent: Record<string, unknown>[] = [];
	send(data: string): void {
		this.sent.push(JSON.parse(data));
	}
	receive(message: Record<string, unknown>): void {
		this.emit("message", Buffer.from(JSON.stringify(message)));
	}
}

function connect(link: ReturnType<typeof createBrowserLink>): FakeSocket {
	const ws = new FakeSocket();
	link.attach(ws as unknown as LinkSocket);
	ws.receive({ type: "hello", version: "1.2.3" });
	return ws;
}

describe("createBrowserLink", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it("relays a request and returns the reply with the extension version", async () => {
		const link = createBrowserLink();
		const ws = connect(link);
		const reply = link.request({ op: "status" }, 1000);
		await vi.advanceTimersByTimeAsync(0);
		const { id } = ws.sent[0] as { id: string };
		expect(ws.sent[0]).toMatchObject({ type: "request", op: "status" });
		const result = { tabUrl: "https://github.com/", contentScript: true };
		ws.receive({ type: "response", id, ok: true, result });
		await expect(reply).resolves.toEqual({
			ok: true,
			result,
			version: "1.2.3",
		});
	});

	it("fails fast when no extension has connected recently", async () => {
		const link = createBrowserLink({ recentLinkMs: 0 });
		vi.advanceTimersByTime(1);
		await expect(link.request({ op: "status" }, 1000)).rejects.toMatchObject({
			status: 503,
			message: expect.stringContaining("no assist extension is connected"),
		});
	});

	it("waits for a recently seen extension to reconnect", async () => {
		const link = createBrowserLink({ reconnectWaitMs: 5000 });
		const reply = link.request({ op: "status" }, 1000);
		await vi.advanceTimersByTimeAsync(100);
		const ws = connect(link);
		await vi.advanceTimersByTimeAsync(0);
		const { id } = ws.sent[0] as { id: string };
		ws.receive({ type: "response", id, ok: false, error: "nope" });
		await expect(reply).resolves.toMatchObject({ ok: false, error: "nope" });
	});

	it("gives up when the extension does not reconnect in time", async () => {
		const link = createBrowserLink({ reconnectWaitMs: 5000 });
		const reply = link.request({ op: "status" }, 1000);
		const assertion = expect(reply).rejects.toMatchObject({ status: 503 });
		await vi.advanceTimersByTimeAsync(5000);
		await assertion;
	});

	it("times out when the extension does not reply", async () => {
		const link = createBrowserLink();
		connect(link);
		const reply = link.request({ op: "status" }, 1000);
		const assertion = expect(reply).rejects.toMatchObject({
			status: 504,
			message: expect.stringContaining("did not reply within 1s"),
		});
		await vi.advanceTimersByTimeAsync(1000);
		await assertion;
	});

	it("rejects pending requests when the extension disconnects", async () => {
		const link = createBrowserLink({ recentLinkMs: 0 });
		const ws = connect(link);
		const reply = link.request({ op: "status" }, 1000);
		await vi.advanceTimersByTimeAsync(0);
		ws.emit("close");
		await expect(reply).rejects.toMatchObject({ status: 502 });
		vi.advanceTimersByTime(1);
		await expect(link.request({ op: "status" }, 1000)).rejects.toMatchObject({
			status: 503,
		});
	});
});
