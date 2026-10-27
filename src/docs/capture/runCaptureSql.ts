import { Client } from "pg";
import type { CaptureHome } from "./createCaptureHome";

export async function runCaptureSql(
	capture: CaptureHome,
	sql: string,
): Promise<void> {
	const client = new Client({ connectionString: capture.databaseUrl });
	await client.connect();
	try {
		await client.query(sql);
	} finally {
		await client.end();
	}
}
