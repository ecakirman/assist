import type { Session } from "./createSession";
import { daemonLog } from "./daemonLog";
import { flushPhaseActiveMs } from "./flushPhaseActiveMs";
import { setStatus } from "./setStatus";
import { shouldAutoDismiss } from "./shouldAutoDismiss";
import { startTranscriptTitleGeneration } from "./startTranscriptTitleGeneration";

export type StatusChangeDeps = {
	dismiss: (id: string) => void;
	notify: () => void;
};

export function finishStatusChange(
	session: Session,
	status: Session["status"],
	exitCode: number | undefined,
	deps: StatusChangeDeps,
): void {
	daemonLog(`session ${session.id} status: ${session.status} -> ${status}`);
	void flushPhaseActiveMs(session);
	setStatus(session, status);
	if (status === "waiting")
		startTranscriptTitleGeneration(session, deps.notify);
	if (status !== "stopped") session.undurable = undefined;
	if (shouldAutoDismiss(session, exitCode)) deps.dismiss(session.id);
	else deps.notify();
}
