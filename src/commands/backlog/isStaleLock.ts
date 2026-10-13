import { bootedAt } from "./bootedAt";
import { processStartedAt } from "./processStartedAt";

const clockSlackMs = 5000;

export function isStaleLock(pid: number, timestamp: unknown): boolean {
	if (typeof timestamp !== "string") return false;
	const lockedAt = Date.parse(timestamp);
	if (Number.isNaN(lockedAt)) return false;
	if (lockedAt < bootedAt() - clockSlackMs) return true;
	const startedAt = processStartedAt(pid);
	return startedAt !== undefined && startedAt > lockedAt + clockSlackMs;
}
