import type { InventoryItem } from "./InventoryItem";

export function collectWebRoutes(appRoutesSource: string): InventoryItem[] {
	return [...appRoutesSource.matchAll(/<Route\s+path="([^"]+)"/g)]
		.map((match) => match[1].replace(/\/\*$/, ""))
		.filter((path) => path !== "*")
		.map((path) => ({ id: `route:/${path}`, description: "" }));
}
