import type { VerifyEntry } from "./VerifyEntry";
import type { VerifyMode } from "./resolveVerifyMode";

const FIX_SUFFIX = ":fix";

// MakerXStudio/verify verify:<name>:fix convention
export function selectEntriesForMode(
	entries: VerifyEntry[],
	mode: VerifyMode,
): VerifyEntry[] {
	if (mode === "check") {
		return entries.filter((e) => !e.name.endsWith(FIX_SUFFIX));
	}
	const names = new Set(entries.map((e) => e.name));
	return entries.filter((e) => !names.has(`${e.name}${FIX_SUFFIX}`));
}
