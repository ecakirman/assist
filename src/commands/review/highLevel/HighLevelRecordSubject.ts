import type { HighLevelCheckResult } from "./types";

export type HighLevelRecordSubject = {
	repo: string;
	prNumber: number;
	headRef: string;
	headSha: string;
	checks: HighLevelCheckResult[];
};
