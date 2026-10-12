export function playTooltip(unavailableOn?: string): string {
	return unavailableOn ? `Not cloned on ${unavailableOn}` : "Build";
}
