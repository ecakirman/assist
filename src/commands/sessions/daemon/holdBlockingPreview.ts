import type { PrPreview } from "../shared/SessionInfoBase";
import type { SessionClient } from "./broadcast";
import type { Session } from "./createSession";
import { supersedePendingPreview } from "./supersedePendingPreview";

export function holdBlockingPreview(
	session: Session,
	waiters: Map<string, SessionClient>,
	client: SessionClient,
	preview: PrPreview,
): void {
	const supersedes = supersedePendingPreview(
		session,
		waiters,
		preview.requestId,
	);
	session.pendingPrPreview = supersedes ? { ...preview, supersedes } : preview;
	waiters.set(session.id, client);
}
