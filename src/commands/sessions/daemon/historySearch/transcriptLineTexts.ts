import type { HarnessKind } from "../../../../shared/harnesses";
import { parseCodexTranscriptLines } from "../../shared/codex/parseCodexTranscriptLines";
import {
	entryMessages,
	type TranscriptMessage,
} from "../../shared/entryMessages";

export function transcriptLineTexts(
	line: string,
	harness: HarnessKind | undefined,
): string[] {
	const messages =
		harness === "codex"
			? parseCodexTranscriptLines([line])
			: claudeMessages(line);
	return messages.flatMap((m) => (m.role === "tool" ? [] : [m.text]));
}

function claudeMessages(line: string): TranscriptMessage[] {
	try {
		const entry: unknown = JSON.parse(line);
		return entry && typeof entry === "object"
			? entryMessages(entry as Record<string, unknown>)
			: [];
	} catch {
		return [];
	}
}
