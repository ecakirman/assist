import { collectDocsInventory } from "./inventory/collectDocsInventory";

export function printDocsInventory(): void {
	console.log(JSON.stringify(collectDocsInventory().map((item) => item.id)));
}

printDocsInventory();
