import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makePty } from "../../../test/mothers/makePty";
import { makeSession } from "../../../test/mothers/makeSession";

vi.mock("./findPortHolderPid", () => ({ findPortHolderPid: vi.fn() }));
vi.mock("./daemonLog", () => ({ daemonLog: vi.fn() }));
vi.mock("./wirePtyEvents", () => ({ wirePtyEvents: vi.fn() }));

import { awaitServerPort, portWaitTiming } from "./awaitServerPort";
import type { SessionClient } from "./broadcast";
import { daemonLog } from "./daemonLog";
import { findPortHolderPid } from "./findPortHolderPid";

const holder = vi.mocked(findPortHolderPid);

function heldServerRun() {
	const { pty } = makePty();
	const start = vi.fn(() => pty);
	const session = makeSession({
		id: "7",
		name: "run: dev",
		commandType: "run",
		runName: "dev",
		server: true,
		serverPort: 3000,
		pendingStart: start,
	});
	const deps = {
		sessions: new Map([[session.id, session]]),
		clients: new Set<SessionClient>(),
		onStatusChange: vi.fn(),
		notify: vi.fn(),
	};
	awaitServerPort(session, 3000, deps);
	return { session, start, pty, deps };
}

describe("awaitServerPort", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();
	});
	afterEach(() => vi.useRealTimers());

	it("spawns as soon as the port is free", () => {
		holder.mockReturnValue(undefined);
		const { session, pty } = heldServerRun();

		vi.advanceTimersByTime(portWaitTiming.pollMs);

		expect(session.pty).toBe(pty);
		expect(session.pendingStart).toBeUndefined();
		expect(daemonLog).toHaveBeenCalledWith(
			'session 7 ("run: dev") port 3000 freed',
		);
	});

	it("keeps holding while the port is held, then spawns once it frees", () => {
		holder.mockReturnValue(4242);
		const { session, start, pty } = heldServerRun();

		vi.advanceTimersByTime(portWaitTiming.pollMs * 3);
		expect(start).not.toHaveBeenCalled();

		holder.mockReturnValue(undefined);
		vi.advanceTimersByTime(portWaitTiming.pollMs);

		expect(start).toHaveBeenCalledTimes(1);
		expect(session.pty).toBe(pty);
	});

	it("errors the card naming the port and holder when the wait times out", () => {
		holder.mockReturnValue(4242);
		const { session, start, deps } = heldServerRun();

		vi.advanceTimersByTime(
			portWaitTiming.timeoutMs + portWaitTiming.pollMs * 2,
		);

		expect(start).not.toHaveBeenCalled();
		expect(session.pendingStart).toBeUndefined();
		expect(session.error).toBe("port 3000 is still held by pid 4242");
		expect(deps.onStatusChange).toHaveBeenCalledWith(session, "error");
		expect(daemonLog).toHaveBeenCalledWith(
			`session 7 ("run: dev") gave up waiting for port 3000 after ${portWaitTiming.timeoutMs}ms`,
		);
	});

	it("stops polling once the card is retried", () => {
		holder.mockReturnValue(4242);
		const { session, start } = heldServerRun();

		session.pendingStart = undefined;
		vi.advanceTimersByTime(portWaitTiming.timeoutMs * 2);

		expect(start).not.toHaveBeenCalled();
		expect(session.error).toBeUndefined();
	});
});
