import { formatRateLimitTimeLeft } from "../../../../../../../../../shared/rateLimitLevel";

export function limitChipTimeLabel(
	resetsAt: number | undefined,
	fallbackLabel: string,
	now: number,
): string {
	return resetsAt != null
		? formatRateLimitTimeLeft(resetsAt, now)
		: fallbackLabel;
}
