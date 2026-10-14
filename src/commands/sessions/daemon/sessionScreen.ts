import { createScreenMirror, type ScreenMirror } from "./createScreenMirror";
import type { Session } from "./types";
import { viewerSize } from "./viewerSize";

export function sessionScreen(session: Session): ScreenMirror {
	if (!session.screen) {
		const fallback = viewerSize();
		session.screen = createScreenMirror(
			session.cols ?? session.pty?.cols ?? fallback.cols,
			session.rows ?? session.pty?.rows ?? fallback.rows,
		);
		if (session.scrollback) session.screen.write(session.scrollback);
	}
	return session.screen;
}
