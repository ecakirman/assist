import { appendDaemonLog } from "./daemon/appendDaemonLog";
import { sendToDaemonAwaitAck } from "./daemon/sendToDaemonAwaitAck";
import { readHookClaudeSessionId } from "./readHookClaudeSessionId";

const RELIABLE_ATTEMPTS = 3;
const RETRY_DELAY_MS = 100;

type SetStatusOptions = { source?: string; ack?: boolean };

// why: every set-status awaits the daemon's ack, even a best-effort hint. The
// daemon greets each connection with the full scrollback replay, so a
// fire-and-forget hook that exits right after writing closes its socket with
// unread data, resetting the daemon's end before it has read the line.
export async function setSessionStatus(
	status: string,
	opts: SetStatusOptions = {},
): Promise<void> {
	const sessionId = process.env.ASSIST_SESSION_ID;
	logHookFired(status, sessionId, opts.source);
	if (!sessionId) return;
	const payload = buildPayload(
		sessionId,
		status,
		opts.source,
		await readHookClaudeSessionId(),
	);
	await deliver(sessionId, status, payload, opts.ack ? RELIABLE_ATTEMPTS : 1);
}

function buildPayload(
	sessionId: string,
	status: string,
	source: string | undefined,
	claudeSessionId: string | undefined,
): Record<string, unknown> {
	const payload: Record<string, unknown> = {
		type: "set-status",
		sessionId,
		status,
	};
	if (claudeSessionId) payload.claudeSessionId = claudeSessionId;
	if (source) payload.source = source;
	payload.ack = true;
	return payload;
}

async function deliver(
	sessionId: string,
	status: string,
	payload: Record<string, unknown>,
	attempts: number,
): Promise<void> {
	for (let attempt = 1; attempt <= attempts; attempt++) {
		try {
			await sendToDaemonAwaitAck(payload);
			return;
		} catch (error) {
			if (attempt < attempts) {
				await sleep(RETRY_DELAY_MS);
				continue;
			}
			appendDaemonLog(
				`set-status delivery failed after ${attempts} attempt${attempts === 1 ? "" : "s"}: id=${sessionId} status=${status}${payload.source ? ` source=${payload.source}` : ""}: ${describeError(error)}`,
			);
		}
	}
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function describeError(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

function logHookFired(
	status: string,
	sessionId: string | undefined,
	source: string | undefined,
): void {
	appendDaemonLog(
		`set-status hook fired: id=${sessionId ?? "none"} status=${status}${source ? ` source=${source}` : ""}`,
	);
}
