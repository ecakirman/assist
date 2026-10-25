import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import type { Session } from "./types";

function isLive(session: Session): boolean {
	return (
		!!session.pty && session.status !== "done" && session.status !== "error"
	);
}

export function isLiveAgent(session: Session): boolean {
	return isLive(session) && session.commandType !== "run";
}

function serverRunDirs(sessions: Session[], file: string): Set<string> {
	return new Set(
		sessions
			.filter((s) => s.server && s.cwd && isLive(s))
			.map((s) => resolve(s.cwd as string))
			.filter((dir) => existsSync(join(dir, file))),
	);
}

export function findServerParents(
	sessions: Map<string, Session>,
	file: string,
): Session[] {
	const all = [...sessions.values()];
	const dirs = serverRunDirs(all, file);
	return all.filter((s) => isLiveAgent(s) && s.cwd && dirs.has(resolve(s.cwd)));
}
