import { createScreenMirror, type ScreenMirror } from "./createScreenMirror";
import type { Session } from "./types";

const DEFAULT_COLS = 120;
const DEFAULT_ROWS = 30;

export function sessionScreen(session: Session): ScreenMirror {
	if (!session.screen) {
		session.screen = createScreenMirror(
			session.cols ?? DEFAULT_COLS,
			session.rows ?? DEFAULT_ROWS,
		);
		if (session.scrollback) session.screen.write(session.scrollback);
	}
	return session.screen;
}
