import type { Session } from "./createSession";
import { daemonLog } from "./daemonLog";
import type { PersistedSession } from "./loadPersistedSessions";
import type { restoreBase } from "./restoreBase";
import { runningSession } from "./runningSession";
import { serverRunMeta } from "./serverRunMeta";
import { spawnRun } from "./spawnRun";

type RestoreBase = ReturnType<typeof restoreBase>;

export function restoreServerRun(
	id: string,
	persisted: PersistedSession,
	base: RestoreBase,
): Session | null {
	if (persisted.commandType !== "run" || !persisted.runName) return null;
	const meta = serverRunMeta(persisted.runName, persisted.cwd);
	if (!meta.server) return null;
	daemonLog(
		`relaunching server run session ${id} ("${persisted.name}") for ${meta.origin} (${meta.group})`,
	);
	const pty = spawnRun({
		name: persisted.runName,
		args: persisted.runArgs,
		cwd: persisted.cwd,
	});
	return {
		...runningSession(base, persisted, pty),
		runName: persisted.runName,
		runArgs: persisted.runArgs,
		server: true,
		serverPort: meta.port,
		serverOrigin: meta.origin,
		serverGroup: meta.group,
	};
}
