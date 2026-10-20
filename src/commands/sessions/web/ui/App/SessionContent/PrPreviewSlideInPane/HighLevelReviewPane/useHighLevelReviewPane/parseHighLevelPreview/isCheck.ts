import type { HighLevelCheckResult } from "../../../../../../../../../review/highLevel/types";

export function isCheck(value: unknown): value is HighLevelCheckResult {
	const check = value as HighLevelCheckResult | undefined;
	return (
		typeof check?.id === "string" &&
		typeof check.title === "string" &&
		typeof check.reason === "string" &&
		(check.kind === "deterministic" || check.kind === "manual") &&
		["pass", "fail", "manual"].includes(check.status)
	);
}
