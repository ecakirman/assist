import { daemonLog } from "./daemonLog";
import { findLastWriter } from "./findLastWriter";
import { findServerParents } from "./findServerParents";
import type { WriteTarget } from "./lastWriteTimes";
import type { Session } from "./types";

export async function findDocsSession(
	sessions: Map<string, Session>,
	target: WriteTarget,
): Promise<string | undefined> {
	const parents = findServerParents(sessions, target.file);
	daemonLog(
		`server parents of ${target.file}: ${parents.map((s) => s.id).join(", ") || "none"}`,
	);
	if (parents.length === 0) return findLastWriter(sessions.values(), target);
	if (parents.length === 1) return parents[0].id;
	const latest = [...parents].sort((a, b) => b.startedAt - a.startedAt)[0];
	return (await findLastWriter(parents, target)) ?? latest.id;
}
