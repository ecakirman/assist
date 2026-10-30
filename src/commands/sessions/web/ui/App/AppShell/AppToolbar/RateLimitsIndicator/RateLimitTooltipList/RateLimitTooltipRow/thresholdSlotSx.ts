const slate = { display: "contents" } as const;

export function thresholdSlotSx(isSlate: boolean, back: boolean) {
	if (isSlate) return slate;
	return {
		display: "inline-flex",
		gap: 0.5,
		minWidth: "6ch",
		justifyContent: back ? "flex-end" : "flex-start",
	};
}
