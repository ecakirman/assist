import { defaultCriticalPaths } from "../../../shared/defaultCriticalPaths";
import type { ConfigKeyQuestion } from "../../config/resolveConfigKeyAnswer";
import { highLevelConfigKeys } from "./highLevelConfigKeys";
import type { ProposedGlobs } from "./ProposedGlobs";
import type { HighLevelConfig } from "./resolveHighLevelConfig";

type CurrentHighLevelConfig = Omit<HighLevelConfig, "criticalPaths"> & {
	criticalPaths: string[] | undefined;
};

export function buildHighLevelQuestions(
	current: CurrentHighLevelConfig,
	proposed: ProposedGlobs,
): ConfigKeyQuestion[] {
	return [
		{
			key: highLevelConfigKeys.criticalPaths,
			question:
				"Critical paths — comma-separated globs whose full diffs the review shows (blank to leave unset)",
			suggest: suggestCriticalPaths(
				current.criticalPaths,
				proposed.criticalPaths,
			),
		},
		{
			key: highLevelConfigKeys.uiPaths,
			question:
				"UI paths — comma-separated globs that make a change a UI change, so a screenshot or video is required (blank to leave unset)",
			suggest: suggestGlobs(current.uiPaths, proposed.uiPaths),
		},
		{
			key: highLevelConfigKeys.descriptionWordCap,
			question: "Description word cap (blank to leave unset)",
			suggest: String(current.descriptionWordCap),
		},
		{
			key: highLevelConfigKeys.collapsedPaths,
			question:
				"Collapsed paths — comma-separated globs whose files start collapsed in the changed-files tree (blank to leave unset)",
			suggest: suggestGlobs(current.collapsedPaths, []),
		},
	];
}

function suggestCriticalPaths(
	current: string[] | undefined,
	proposed: string[],
): string | undefined {
	if (current) return suggestGlobs(current, []);
	return [...new Set([...defaultCriticalPaths, ...proposed])].join(",");
}

function suggestGlobs(
	current: string[],
	proposed: string[],
): string | undefined {
	const globs = current.length > 0 ? current : proposed;
	return globs.length > 0 ? globs.join(",") : undefined;
}
