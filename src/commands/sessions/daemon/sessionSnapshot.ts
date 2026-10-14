import type { Session } from "./types";
import { stripReplayQueries } from "./stripReplayQueries";

export function sessionSnapshot(s: Session): string {
	return stripReplayQueries(s.screen?.snapshot() ?? s.scrollback);
}
