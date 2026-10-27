import { getDb } from "../../shared/db/getDb";
import { loadConfig } from "../../shared/loadConfig";
import { dbBackedConfigKeys } from "./dbBackedConfigKeys";
import { setNestedValue } from "./setNestedValue";

function covers(scope: string | undefined, key: string): boolean {
	return (
		scope === undefined ||
		scope === key ||
		key.startsWith(`${scope}.`) ||
		scope.startsWith(`${key}.`)
	);
}

export function dbBackedKeysIn(scope?: string): string[] {
	if (!process.env.ASSIST_DATABASE_URL && !loadConfig().database.url) return [];
	return Object.keys(dbBackedConfigKeys).filter((key) => covers(scope, key));
}

export async function withDbBackedConfigValues<T extends object>(
	config: T,
	keys: string[],
): Promise<T> {
	if (keys.length === 0) return config;
	const db = await getDb();
	let merged = config as Record<string, unknown>;
	for (const key of keys) {
		const value = await dbBackedConfigKeys[key].read(db);
		if (value !== undefined) merged = setNestedValue(merged, key, value);
	}
	return merged as T;
}
