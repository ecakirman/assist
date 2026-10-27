import { configEntryLayers } from "./configEntryLayers";
import { readRawConfigLayers } from "./readRawConfigLayers";

export function isConfigKeySet(
	key: string,
	cwd: string = process.cwd(),
): boolean {
	const layers = configEntryLayers(key, readRawConfigLayers(cwd), undefined);
	return Object.keys(layers).length > 0;
}
