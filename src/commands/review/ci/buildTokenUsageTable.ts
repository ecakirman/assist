import type { TokenUsage } from "../TokenUsage";

const SLOT_LABELS = ["Reviewer 1", "Reviewer 2", "Synthesis"];
const DASH = "—";

type Cells = [string, string, string, string];

function format(value: number | undefined): string {
	return value === undefined ? DASH : value.toLocaleString("en-US");
}

function cells(usage: TokenUsage | undefined): Cells {
	if (!usage) return [DASH, DASH, DASH, DASH];
	return [
		format(usage.input),
		format(usage.output),
		format(usage.cacheRead),
		format(usage.cacheWrite),
	];
}

function sumOf(
	reported: TokenUsage[],
	pick: (usage: TokenUsage) => number | undefined,
): number | undefined {
	const values = reported.map(pick).filter((v): v is number => v !== undefined);
	return values.length === 0 ? undefined : values.reduce((a, b) => a + b, 0);
}

function total(usages: (TokenUsage | undefined)[]): Cells {
	const reported = usages.filter((u): u is TokenUsage => u !== undefined);
	return [
		format(sumOf(reported, (u) => u.input)),
		format(sumOf(reported, (u) => u.output)),
		format(sumOf(reported, (u) => u.cacheRead)),
		format(sumOf(reported, (u) => u.cacheWrite)),
	];
}

function row(label: string, values: Cells): string {
	return `| ${label} | ${values.join(" | ")} |`;
}

export function buildTokenUsageTable(
	usages: (TokenUsage | undefined)[],
): string {
	return [
		"## Token usage",
		"",
		"| Slot | Input | Output | Cache read | Cache write |",
		"| --- | ---: | ---: | ---: | ---: |",
		...usages.map((usage, i) =>
			row(SLOT_LABELS[i] ?? `Slot ${i + 1}`, cells(usage)),
		),
		row("**Total**", total(usages)),
	].join("\n");
}
