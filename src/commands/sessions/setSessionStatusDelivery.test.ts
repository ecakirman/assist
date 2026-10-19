import { mkdtempSync, rmSync } from "node:fs";
import * as net from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleConnection } from "./daemon/handleConnection";
import type { SessionManager } from "./daemon/SessionManager";
import { setSessionStatus } from "./setSessionStatus";

const paths = vi.hoisted(() => ({ socket: "" }));

vi.mock("./daemon/daemonPaths", () => ({ daemonPaths: paths }));
vi.mock("./daemon/daemonLog", () => ({ daemonLog: vi.fn() }));
vi.mock("./daemon/appendDaemonLog", () => ({ appendDaemonLog: vi.fn() }));
vi.mock("./readHookClaudeSessionId", () => ({
	readHookClaudeSessionId: vi.fn(async () => undefined),
}));

const SCROLLBACK_REPLAY = "x".repeat(4 * 1024 * 1024);

function fakeManager(statuses: Map<string, string>): SessionManager {
	return {
		addClient: (client: { send: (data: string) => void }) =>
			client.send(SCROLLBACK_REPLAY),
		removeClient: () => {},
		clients: { greet: () => {} },
		links: { route: () => false },
		setStatus: ({ id, status }: { id: string; status: string }) =>
			statuses.set(id, status),
	} as unknown as SessionManager;
}

describe("setSessionStatus delivery to a daemon that greets with scrollback", () => {
	let dir: string;
	let server: net.Server;
	const statuses = new Map<string, string>();

	beforeEach(async () => {
		dir = mkdtempSync(join(tmpdir(), "assist-set-status-"));
		paths.socket = join(dir, "daemon.sock");
		statuses.clear();
		process.env.ASSIST_SESSION_ID = "15";
		server = net.createServer((socket) =>
			handleConnection(socket, fakeManager(statuses)),
		);
		await new Promise<void>((resolve) => server.listen(paths.socket, resolve));
	});

	afterEach(async () => {
		delete process.env.ASSIST_SESSION_ID;
		await new Promise((resolve) => server.close(resolve));
		rmSync(dir, { recursive: true, force: true });
	});

	it("moves the session back to running once the running hook resolves after a waiting", async () => {
		await setSessionStatus("waiting", { source: "notification", ack: true });
		expect(statuses.get("15")).toBe("waiting");

		await setSessionStatus("running", { source: "pretool" });

		expect(statuses.get("15")).toBe("running");
	});
});
