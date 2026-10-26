import type { CaptureHome } from "./createCaptureHome";
import { runAssist } from "./runAssist";

export function resetPeers(capture: CaptureHome): void {
	for (const name of capture.linkedPeers)
		runAssist(capture, ["sessions", "nodes", "unlink", name]);
	capture.linkedPeers.clear();
	for (const peer of capture.peers.values())
		runAssist(peer.capture, ["daemon", "drain", "--yes"]);
}
