import { asRecord } from "./asRecord";

const WRITE_TOOLS = new Set(["Write", "Edit", "MultiEdit", "NotebookEdit"]);

export function writtenFilePaths(entry: Record<string, unknown>): string[] {
	if (entry.type !== "assistant") return [];
	const content = asRecord(entry.message)?.content;
	if (!Array.isArray(content)) return [];
	const paths: string[] = [];
	for (const block of content) {
		const b = asRecord(block);
		if (b?.type !== "tool_use" || !WRITE_TOOLS.has(String(b.name))) continue;
		const input = asRecord(b.input);
		const path = input?.file_path ?? input?.notebook_path;
		if (typeof path === "string") paths.push(path);
	}
	return paths;
}
