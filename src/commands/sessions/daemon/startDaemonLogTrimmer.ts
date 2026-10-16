import { daemonLog } from "./daemonLog";
import { trimDaemonLog } from "./trimDaemonLog";

const TRIM_INTERVAL_MS = 5 * 60_000;

export function startDaemonLogTrimmer(
	intervalMs = TRIM_INTERVAL_MS,
): () => void {
	const tick = () => {
		try {
			const result = trimDaemonLog();
			if (result)
				daemonLog(
					`trimmed daemon.log from ${result.before} to ${result.after} bytes`,
				);
		} catch (error) {
			daemonLog(`daemon.log trim failed: ${String(error)}`);
		}
	};
	tick();
	const timer = setInterval(tick, intervalMs);
	timer.unref();
	return () => clearInterval(timer);
}
