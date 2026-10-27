import { Client } from "pg";
import type { CaptureHome } from "./createCaptureHome";

export async function resetBacklog(capture: CaptureHome): Promise<void> {
	const client = new Client({ connectionString: capture.databaseUrl });
	await client.connect();
	try {
		await client.query("TRUNCATE items RESTART IDENTITY CASCADE");
	} finally {
		await client.end();
	}
}
