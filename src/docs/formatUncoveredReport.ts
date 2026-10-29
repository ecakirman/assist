import type { InventoryItem } from "./inventory/InventoryItem";

export function formatUncoveredReport(
	inventory: InventoryItem[],
	covered: ReadonlySet<string>,
): string {
	const uncovered = inventory.filter((item) => !covered.has(item.id));
	if (uncovered.length === 0)
		return `All ${inventory.length} items are documented.`;

	const kinds = [...new Set(uncovered.map((item) => item.id.split(":")[0]))];
	const sections = kinds.map((kind) => {
		const items = uncovered.filter((item) => item.id.startsWith(`${kind}:`));
		const lines = items.map(({ id, description }) =>
			description ? `  ${id} — ${description}` : `  ${id}`,
		);
		return [`${kind} (${items.length})`, ...lines].join("\n");
	});
	return [
		...sections,
		`${uncovered.length} of ${inventory.length} items are documented by no page.`,
	].join("\n\n");
}
