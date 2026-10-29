import { describe, expect, it, vi } from "vitest";
import { handleHelloRequest } from "./handleHelloRequest";
import type { SessionManager } from "./SessionManager";

vi.mock("./daemonLog", () => ({ daemonLog: vi.fn() }));

function createManager() {
	return {
		replayAll: vi.fn(),
		replayLocal: vi.fn(),
		localSessions: vi.fn(() => []),
		clients: { markPeer: vi.fn() },
	} as unknown as SessionManager;
}

describe("handleHelloRequest", () => {
	it("replays every session's scrollback to a viewer", () => {
		const manager = createManager();
		const client = { send: vi.fn() };

		handleHelloRequest(client, manager, { type: "hello" });

		expect(manager.replayAll).toHaveBeenCalledWith(client);
		expect(manager.replayLocal).not.toHaveBeenCalled();
	});

	it("replays only local scrollback to a peer link", () => {
		const manager = createManager();
		const client = { send: vi.fn() };

		handleHelloRequest(client, manager, { type: "hello", peer: true });

		expect(manager.replayLocal).toHaveBeenCalledWith(client);
		expect(manager.replayAll).not.toHaveBeenCalled();
	});
});
