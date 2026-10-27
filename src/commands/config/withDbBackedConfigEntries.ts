import { getDb } from "../../shared/db/getDb";
import type { ConfigEntry } from "./ConfigEntry";
import { dbBackedConfigKeys, isDbBackedConfigKey } from "./dbBackedConfigKeys";
import { dbBackedKeysIn } from "./withDbBackedConfigValues";

export const DB_BACKED_CONFIG_FILE = "the shared db (all nodes)";

function dbBackedEntry(entry: ConfigEntry, value: unknown): ConfigEntry {
	const set = value !== undefined;
	return {
		...entry,
		value: set ? value : entry.defaultValue,
		source: set ? "global" : "default",
		sources: set ? ["global"] : [],
		layers: set ? { global: value } : {},
		globalConfigFile: DB_BACKED_CONFIG_FILE,
		globalOnly: true,
	};
}

export async function withDbBackedConfigEntries(
	entries: ConfigEntry[],
): Promise<ConfigEntry[]> {
	if (dbBackedKeysIn().length === 0) return entries;
	const db = await getDb();
	return Promise.all(
		entries.map(async (entry) =>
			isDbBackedConfigKey(entry.key)
				? dbBackedEntry(entry, await dbBackedConfigKeys[entry.key].read(db))
				: entry,
		),
	);
}
