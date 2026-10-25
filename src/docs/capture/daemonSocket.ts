import { basename, join } from "node:path";

export function daemonSocket(home: string): string {
	return process.platform === "win32"
		? String.raw`\\.\pipe\assist-sessions-daemon-${basename(home)}`
		: join(home, ".assist", "daemon", "daemon.sock");
}
