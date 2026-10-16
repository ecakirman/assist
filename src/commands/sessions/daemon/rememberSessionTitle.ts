import { saveSessionTitle } from "../shared/loadSessionTitles";
import type { Session } from "./createSession";
import { daemonLog } from "./daemonLog";

export function rememberSessionTitle(session: Session): void {
	const harnessSessionId =
		session.harness === "codex"
			? session.harnessSessionId
			: session.claudeSessionId;
	const title = session.title ?? session.generatedTitle;
	if (!harnessSessionId || !title) return;
	try {
		if (saveSessionTitle(harnessSessionId, title))
			daemonLog(`session ${session.id} title kept for ${harnessSessionId}`);
	} catch (error) {
		daemonLog(`session ${session.id} title not saved: ${error}`);
	}
}
