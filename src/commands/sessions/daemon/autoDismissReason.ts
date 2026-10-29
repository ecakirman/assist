import type { Session } from "./createSession";

export function autoDismissReason(session: Session): string {
	if (session.reviewStarted)
		return `backlog run reached review (Continue ${session.autoAdvance ? "on" : "off"})`;
	return `assist ${session.assistArgs?.join(" ") ?? ""} exited cleanly`;
}
