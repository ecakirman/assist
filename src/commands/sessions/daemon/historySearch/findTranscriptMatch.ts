import * as fs from "node:fs";
import * as readline from "node:readline";
import type { HarnessKind } from "../../../../shared/harnesses";
import type { HistorySnippet } from "../../shared/HistorySnippet";
import { historySnippet } from "./historySnippet";
import { transcriptLineTexts } from "./transcriptLineTexts";

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

function encodesVerbatimInJson(query: string): boolean {
	return JSON.stringify(query) === `"${query}"`;
}

function rawLinePrefilter(query: string): (line: string) => boolean {
	if (!encodesVerbatimInJson(query)) return () => true;
	const lower = query.toLowerCase();
	return (line) => line.toLowerCase().includes(lower);
}

function matchTexts(texts: string[], pattern: RegExp): HistorySnippet | null {
	for (const text of texts) {
		const found = pattern.exec(text);
		if (found) return historySnippet(text, found.index, found[0].length);
	}
	return null;
}

function queryPattern(query: string): RegExp {
	return new RegExp(escapeRegExp(query), "i");
}

export async function findTranscriptMatch(
	filePath: string,
	harness: HarnessKind | undefined,
	query: string,
): Promise<HistorySnippet | null> {
	const pattern = queryPattern(query);
	const mayMatch = rawLinePrefilter(query);
	const stream = fs.createReadStream(filePath, { encoding: "utf8" });
	const reader = readline.createInterface({
		input: stream,
		crlfDelay: Infinity,
	});
	try {
		for await (const line of reader) {
			if (!line || !mayMatch(line)) continue;
			const snippet = matchTexts(transcriptLineTexts(line, harness), pattern);
			if (snippet) return snippet;
		}
		return null;
	} catch {
		return null;
	} finally {
		reader.close();
		stream.destroy();
	}
}

export function findTitleMatch(
	title: string | undefined,
	query: string,
): HistorySnippet | null {
	return title ? matchTexts([title], queryPattern(query)) : null;
}
