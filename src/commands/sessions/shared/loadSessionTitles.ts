import { z } from "zod";
import { loadJson, saveJson } from "../../../shared/loadJson";

const TITLES_FILE = "session-titles.json";

const sessionTitlesSchema = z.record(z.string(), z.string());

export function loadSessionTitles(): Record<string, string> {
	const parsed = sessionTitlesSchema.safeParse(
		loadJson<Record<string, unknown>>(TITLES_FILE),
	);
	return parsed.success ? parsed.data : {};
}

export function saveSessionTitle(
	harnessSessionId: string,
	title: string,
): boolean {
	const titles = loadSessionTitles();
	if (titles[harnessSessionId] === title) return false;
	titles[harnessSessionId] = title;
	saveJson(TITLES_FILE, titles);
	return true;
}
