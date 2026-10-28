import { type SessionClient, sendTo } from "./broadcast";
import type { Session } from "./createSession";
import { daemonLog } from "./daemonLog";

export function supersedePendingPreview(
	session: Session,
	waiters: Map<string, SessionClient>,
	newRequestId: unknown,
): string | undefined {
	const pending = session.pendingPrPreview;
	const waiter = waiters.get(session.id);
	if (!pending || pending.kind === "show" || !waiter) return undefined;
	sendTo(waiter, {
		type: "pr-superseded",
		requestId: pending.requestId,
		supersededBy: newRequestId,
	});
	daemonLog(
		`pr-preview superseded: id=${session.id} old=${pending.requestId} new=${newRequestId}`,
	);
	return pending.requestId;
}
