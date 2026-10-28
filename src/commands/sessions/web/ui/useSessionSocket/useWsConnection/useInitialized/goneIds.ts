import type { SessionInfo } from "../../../types";

export function goneIds(
	prevStartedAt: Map<string, number>,
	next: SessionInfo[],
): string[] {
	const nextIds = new Set(next.map((s) => s.id));
	return [...prevStartedAt.keys()].filter((id) => !nextIds.has(id));
}
