import type { SessionClient } from "./broadcast";
import type { Session } from "./createSession";
import { daemonLog } from "./daemonLog";
import { decidePrPreview } from "./decidePrPreview";

export function autoApprovePreview(
	sessions: Map<string, Session>,
	waiters: Map<string, SessionClient>,
	notify: () => void,
	session: Session,
): boolean {
	const preview = session.pendingPrPreview;
	if (!session.autoApprove || !preview?.canStart) return false;
	daemonLog(
		`pr-preview auto-approve: id=${session.id} requestId=${preview.requestId} (approving with autostart)`,
	);
	decidePrPreview(sessions, waiters, notify, {
		sessionId: session.id,
		requestId: preview.requestId,
		decision: "approve",
		autostart: true,
	});
	return true;
}
