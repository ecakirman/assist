import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./spawnRun", () => ({ spawnRun: vi.fn(() => "run-pty") }));
vi.mock("./serverRunMeta", () => ({ serverRunMeta: vi.fn() }));
vi.mock("./daemonLog", () => ({ daemonLog: vi.fn() }));
vi.mock("./findPortHolderPid", () => ({ findPortHolderPid: vi.fn() }));

import { daemonLog } from "./daemonLog";
import { findPortHolderPid } from "./findPortHolderPid";
import type { PersistedSession } from "./loadPersistedSessions";
import { restoreBase } from "./restoreBase";
import { restoreInteractiveSession } from "./restoreInteractiveSession";
import { serverRunMeta } from "./serverRunMeta";
import { spawnRun } from "./spawnRun";

const meta = vi.mocked(serverRunMeta);

function persistedRun(): PersistedSession {
	return {
		name: "run: dev",
		commandType: "run",
		cwd: "/repo",
		startedAt: 1,
		runName: "dev",
		runArgs: ["--watch"],
	};
}

function restore(persisted: PersistedSession) {
	return restoreInteractiveSession(
		"7",
		persisted,
		restoreBase("7", persisted),
		"running",
	);
}

describe("restoring a run session", () => {
	beforeEach(() => vi.clearAllMocks());

	it("relaunches a server run with its server tag", () => {
		meta.mockReturnValue({
			server: true,
			group: "web",
			port: 3000,
			origin: "gh/o/r",
		});

		const session = restore(persistedRun());

		expect(spawnRun).toHaveBeenCalledWith({
			name: "dev",
			args: ["--watch"],
			cwd: "/repo",
		});
		expect(session).toMatchObject({
			status: "running",
			pty: "run-pty",
			runName: "dev",
			runArgs: ["--watch"],
			server: true,
			serverPort: 3000,
			serverOrigin: "gh/o/r",
			serverGroup: "web",
		});
		expect(daemonLog).toHaveBeenCalledWith(
			'relaunching server run session 7 ("run: dev") for gh/o/r (web)',
		);
	});

	it("holds the relaunch while the server's port is still held", () => {
		meta.mockReturnValue({ server: true, group: "web", port: 3000 });
		vi.mocked(findPortHolderPid).mockReturnValue(4242);

		const session = restore(persistedRun());

		expect(spawnRun).not.toHaveBeenCalled();
		expect(session).toMatchObject({ status: "running", pty: null });
		expect(session.pendingStart?.()).toBe("run-pty");
		expect(daemonLog).toHaveBeenCalledWith(
			'session 7 ("run: dev") waiting for port 3000 (held by pid 4242) to free before relaunching',
		);
	});

	it("leaves a non-server run as a retryable done card", () => {
		meta.mockReturnValue({ server: false });

		const session = restore(persistedRun());

		expect(spawnRun).not.toHaveBeenCalled();
		expect(session).toMatchObject({
			status: "done",
			pty: null,
			restored: false,
			runName: "dev",
		});
		expect(session.server).toBeUndefined();
	});
});
