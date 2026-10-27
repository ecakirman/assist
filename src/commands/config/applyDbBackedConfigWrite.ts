import { getDb } from "../../shared/db/getDb";
import type { ConfigWriteScope } from "./ConfigWriteScope";
import { dbBackedConfigKeys } from "./dbBackedConfigKeys";
import { DB_BACKED_CONFIG_FILE } from "./withDbBackedConfigEntries";

type DbBackedConfigWriteResult =
	| { ok: true; payload: Record<string, unknown> }
	| { ok: false; errors: string[] };

export async function applyDbBackedConfigWrite(
	key: string,
	scope: ConfigWriteScope,
	write: { value: unknown } | { unset: true },
): Promise<DbBackedConfigWriteResult> {
	if (scope !== "global")
		return {
			ok: false,
			errors: [`"${key}" is stored in the shared db; save it globally`],
		};
	const handler = dbBackedConfigKeys[key];
	const db = await getDb();
	if ("unset" in write)
		return {
			ok: true,
			payload: {
				target: DB_BACKED_CONFIG_FILE,
				removed: await handler.unset(db),
			},
		};
	await handler.write(db, write.value);
	return { ok: true, payload: { target: DB_BACKED_CONFIG_FILE } };
}
