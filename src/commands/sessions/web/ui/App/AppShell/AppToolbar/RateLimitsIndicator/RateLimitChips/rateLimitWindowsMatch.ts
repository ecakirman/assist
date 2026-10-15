type ChipReading = { pct: number; timeLabel: string };

function readingNumbers({ pct, timeLabel }: ChipReading): string {
	return [Math.round(pct), ...(timeLabel.match(/\d+/g) ?? []).map(Number)].join(
		",",
	);
}

export function rateLimitWindowsMatch(readings: ChipReading[]): boolean {
	if (readings.length !== 2) return false;
	const [a, b] = readings;
	return readingNumbers(a) === readingNumbers(b);
}
