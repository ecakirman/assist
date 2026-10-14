import type { Session } from "./createSession";
import { daemonLog } from "./daemonLog";

export function resizePty(s: Session, cols: number, rows: number): void {
	s.screen?.resize(cols, rows);
	try {
		s.pty?.resize(cols, rows);
	} catch (error) {
		daemonLog(
			`session ${s.id} resize skipped (dead pty): ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}
