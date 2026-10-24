import { docsAreas, type DocsArea } from "./docsAreas";
import type { InventoryItem } from "./inventory/InventoryItem";

export function formatPendingReport(
	inventory: InventoryItem[],
	pending: Partial<Record<DocsArea, string[]>>,
): string {
	const descriptions = new Map(
		inventory.map((item) => [item.id, item.description]),
	);
	const areas = docsAreas.filter((area) => (pending[area] ?? []).length > 0);
	const total = areas.reduce(
		(sum, area) => sum + (pending[area]?.length ?? 0),
		0,
	);
	if (total === 0) return "No items pending user documentation.";

	const sections = areas.map((area) => {
		const ids = pending[area] ?? [];
		const lines = ids.map((id) => {
			const description = descriptions.get(id);
			return description ? `  ${id} — ${description}` : `  ${id}`;
		});
		return [`${area} (${ids.length})`, ...lines].join("\n");
	});
	return [
		...sections,
		`${total} of ${inventory.length} items pending user documentation.`,
	].join("\n\n");
}
