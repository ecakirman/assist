import { closeSync, openSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runAssist } from "./runAssist";
import { spawnAssist } from "./spawnAssist";
import type { CaptureHome } from "./createCaptureHome";
import { findFreePort } from "./findFreePort";

const READY_TIMEOUT_MS = 30_000;

type CaptureServer = { url: string; stop: () => Promise<void> };

async function waitForHttp(url: string, log: string): Promise<void> {
	const deadline = Date.now() + READY_TIMEOUT_MS;
	while (Date.now() < deadline) {
		try {
			if ((await fetch(url)).ok) return;
		} catch {}
		await new Promise((resolve) => setTimeout(resolve, 250));
	}
	throw new Error(
		`Web server did not answer ${url} within ${READY_TIMEOUT_MS / 1000}s:\n${readFileSync(log, "utf8")}`,
	);
}

export async function startCaptureServer(
	capture: CaptureHome,
): Promise<CaptureServer> {
	const port = await findFreePort();
	const url = `http://localhost:${port}`;
	const log = join(capture.home, "web.log");
	const logFd = openSync(log, "a");
	const web = spawnAssist(
		capture,
		["sessions", "web", "--port", String(port), "--no-open"],
		["ignore", logFd, logFd],
	);
	closeSync(logFd);
	const exited = new Promise<void>((resolve) => web.once("exit", resolve));

	const stop = async () => {
		runAssist(capture, ["daemon", "stop"]);
		web.kill();
		await exited;
	};
	try {
		await waitForHttp(url, log);
	} catch (error) {
		await stop();
		throw error;
	}
	return { url, stop };
}
