import { uuidFrom } from "./uuidFrom";

type TranscriptInput = {
	cwd: string;
	prompt: string;
	reply: string[];
	startedAt: Date;
};

const REPLY_GAP_MS = 4_000;

export function claudeProjectDirName(cwd: string): string {
	return cwd.replace(/[^a-zA-Z0-9]/g, "-");
}

export function buildTranscript({
	cwd,
	prompt,
	reply,
	startedAt,
}: TranscriptInput): { sessionId: string; jsonl: string } {
	const sessionId = uuidFrom(`${cwd}\n${prompt}`);
	const base = {
		isSidechain: false,
		userType: "external",
		cwd,
		sessionId,
		version: "2.0.0",
		gitBranch: "main",
	};
	const at = (step: number) =>
		new Date(startedAt.getTime() + step * REPLY_GAP_MS).toISOString();
	const userUuid = uuidFrom(`${sessionId}:0`);
	const entries: Record<string, unknown>[] = [
		{
			...base,
			parentUuid: null,
			type: "user",
			message: { role: "user", content: prompt },
			uuid: userUuid,
			timestamp: at(0),
		},
	];
	let parentUuid = userUuid;
	reply.forEach((text, index) => {
		const uuid = uuidFrom(`${sessionId}:${index + 1}`);
		entries.push({
			...base,
			parentUuid,
			type: "assistant",
			message: {
				role: "assistant",
				model: "claude-sonnet-4-5",
				content: [{ type: "text", text }],
			},
			uuid,
			timestamp: at(index + 1),
		});
		parentUuid = uuid;
	});
	return {
		sessionId,
		jsonl: `${entries.map((entry) => JSON.stringify(entry)).join("\n")}\n`,
	};
}
