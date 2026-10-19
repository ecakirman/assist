import type { PrMergeable } from "./types";

const MAX_ATTEMPTS = 5;
const DELAY_MS = 2000;

function sleepSync(ms: number): void {
	Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

export function waitForMergeable(
	initial: PrMergeable,
	refetch: () => PrMergeable,
	delayMs = DELAY_MS,
): PrMergeable {
	let mergeable = initial;
	for (
		let attempt = 1;
		mergeable === "UNKNOWN" && attempt < MAX_ATTEMPTS;
		attempt++
	) {
		sleepSync(delayMs);
		mergeable = refetch();
	}
	return mergeable;
}
