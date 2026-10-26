import type { CaptureHome } from "./createCaptureHome";

export function closePreviews(capture: CaptureHome): void {
	for (const socket of capture.openPreviews.splice(0)) socket.destroy();
	capture.sessionIds.clear();
}
