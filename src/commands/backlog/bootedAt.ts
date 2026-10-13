import { uptime } from "node:os";

export function bootedAt(): number {
	return Date.now() - uptime() * 1000;
}
