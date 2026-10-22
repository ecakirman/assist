import type { PrPreview } from "../shared/SessionInfoBase";
import type { Session } from "./createSession";
import { daemonLog } from "./daemonLog";
import { previewTargetLabel } from "./previewTargetLabel";

export function placeShowPreview(session: Session, show: PrPreview): boolean {
	const pending = session.pendingPrPreview;
	if (!pending || pending.kind === "show") {
		session.pendingPrPreview = show;
		session.pendingShow = undefined;
		return false;
	}
	session.pendingShow = show;
	const target = previewTargetLabel(
		pending.kind ?? "pr",
		pending.itemType ?? "story",
		pending.prNumber,
		pending.draft === true,
	);
	daemonLog(
		`pr-preview show stacked: id=${session.id} requestId=${show.requestId} over=${target}`,
	);
	return true;
}
