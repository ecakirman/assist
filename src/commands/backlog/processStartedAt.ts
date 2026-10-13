import { readFileSync } from "node:fs";
import { bootedAt } from "./bootedAt";

// why: /proc/<pid>/stat field 22 is the start time in clock ticks since boot; Linux's USER_HZ is 100 on every architecture node ships for.
const clockTicksPerSecond = 100;

export function processStartedAt(pid: number): number | undefined {
	try {
		const stat = readFileSync(`/proc/${pid}/stat`, "utf8");
		const fields = stat.slice(stat.lastIndexOf(")") + 2).split(" ");
		const ticks = Number(fields[19]);
		if (!Number.isFinite(ticks)) return undefined;
		return bootedAt() + (ticks / clockTicksPerSecond) * 1000;
	} catch {
		return undefined;
	}
}
