import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { findDocsSession } from "./findDocsSession";
import { findLastWriter } from "./findLastWriter";
import type { Session } from "./types";

vi.mock("./daemonLog", () => ({ daemonLog: vi.fn() }));
vi.mock("./findLastWriter", () => ({ findLastWriter: vi.fn() }));

const target = { file: "docs/guide/pages/start.json", within: "docs/guide/" };

function repo(): string {
	const dir = mkdtempSync(join(tmpdir(), "docs-session-"));
	mkdirSync(join(dir, "docs/guide/pages"), { recursive: true });
	writeFileSync(join(dir, target.file), "{}");
	return dir;
}

function session(id: string, fields: Partial<Session>): Session {
	return {
		id,
		pty: {},
		status: "running",
		commandType: "claude",
		startedAt: 0,
		...fields,
	} as Session;
}

function sessionMap(...list: Session[]): Map<string, Session> {
	return new Map(list.map((s) => [s.id, s]));
}

describe("findDocsSession", () => {
	beforeEach(() => vi.mocked(findLastWriter).mockReset());

	it("picks the agent session sharing a directory with the docs server", async () => {
		const cwd = repo();
		const sessions = sessionMap(
			session("1", { cwd }),
			session("2", { cwd: repo() }),
			session("3", { cwd, commandType: "run", server: true }),
		);
		expect(await findDocsSession(sessions, target)).toBe("1");
		expect(findLastWriter).not.toHaveBeenCalled();
	});

	it("ignores ended sessions and servers whose directory lacks the page", async () => {
		const cwd = repo();
		const other = mkdtempSync(join(tmpdir(), "docs-session-"));
		vi.mocked(findLastWriter).mockResolvedValue("4");
		const sessions = sessionMap(
			session("1", { cwd, status: "done" }),
			session("2", { cwd: other }),
			session("3", { cwd, commandType: "run", server: true }),
			session("5", { cwd: other, commandType: "run", server: true }),
		);
		expect(await findDocsSession(sessions, target)).toBe("4");
	});

	it("breaks a tie between parents by last writer, else the newest", async () => {
		const cwd = repo();
		const sessions = sessionMap(
			session("1", { cwd, startedAt: 1 }),
			session("2", { cwd, startedAt: 2 }),
			session("3", { cwd, commandType: "run", server: true }),
		);
		vi.mocked(findLastWriter).mockResolvedValueOnce("1");
		expect(await findDocsSession(sessions, target)).toBe("1");
		vi.mocked(findLastWriter).mockResolvedValueOnce(undefined);
		expect(await findDocsSession(sessions, target)).toBe("2");
	});
});
