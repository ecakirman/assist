import { daemonLog } from "./daemonLog";
import { lastWriteTimes, type WriteTarget } from "./lastWriteTimes";
import { resolveTranscriptPath } from "./resolveTranscriptPath";
import type { Session } from "./types";

type Candidate = { id: string; file?: number; within?: number };

function newest(
	candidates: Candidate[],
	key: "file" | "within",
): Candidate | undefined {
	return candidates
		.filter((c) => c[key] !== undefined)
		.sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0))[0];
}

export async function findLastWriter(
	sessions: Map<string, Session>,
	target: WriteTarget,
): Promise<string | undefined> {
	const live = [...sessions.values()].filter(
		(s) => s.pty && s.status !== "done" && s.commandType !== "run",
	);
	const candidates = await Promise.all(
		live.map(async (session): Promise<Candidate> => {
			const transcript = await resolveTranscriptPath(session);
			if (!transcript) return { id: session.id };
			return { id: session.id, ...(await lastWriteTimes(transcript, target)) };
		}),
	);
	const writer = newest(candidates, "file") ?? newest(candidates, "within");
	daemonLog(
		`last writer of ${target.file} (within ${target.within}): ${writer ? `session ${writer.id}` : "none"} of ${live.length} live session(s)`,
	);
	return writer?.id;
}
