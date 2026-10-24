import { rmSync } from "node:fs";
import { runAssist } from "./runAssist";
import { type CaptureHome, createCaptureHome } from "./createCaptureHome";
import { startCapturePostgres } from "./startCapturePostgres";
import { startCaptureServer } from "./startCaptureServer";

type CaptureEnvironment = { capture: CaptureHome; url: string };

export async function withCaptureEnvironment(
	keepHome: boolean,
	run: (environment: CaptureEnvironment) => Promise<void>,
): Promise<void> {
	const postgres = await startCapturePostgres();
	let capture: CaptureHome | undefined;
	try {
		capture = createCaptureHome(postgres.url);
		console.log(`Capturing in isolated HOME ${capture.home}`);
		runAssist(capture, ["db", "migrate"]);
		const server = await startCaptureServer(capture);
		try {
			await run({ capture, url: server.url });
		} finally {
			await server.stop();
		}
	} finally {
		postgres.stop();
		if (capture && keepHome) console.log(`Kept ${capture.home}`);
		else if (capture) rmSync(capture.home, { recursive: true, force: true });
	}
}
