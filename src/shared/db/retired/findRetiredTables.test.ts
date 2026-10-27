import type { PGlite } from "@electric-sql/pglite";
import { beforeEach, describe, expect, it } from "vitest";
import { applyMigrations } from "../migrations/applyMigrations";
import { pgliteExecutor } from "../migrations/MigrationExecutor";
import { sharedTestPglite } from "../sharedTestPglite";
import { findRetiredTables } from "./findRetiredTables";

describe("findRetiredTables", () => {
	let db: PGlite;

	beforeEach(async () => {
		db = await sharedTestPglite();
		await applyMigrations(pgliteExecutor(db));
	});

	it("reports the retired tables created by the baseline with their row counts", async () => {
		await db.exec(
			"INSERT INTO handovers (origin, summary, content) VALUES ('o', 's', 'c'), ('o', 's2', 'c2')",
		);
		expect(await findRetiredTables(pgliteExecutor(db))).toEqual([
			{ name: "handovers", rows: 2 },
			{ name: "item_subtasks", rows: 0 },
		]);
	});

	it("reports nothing once the tables are dropped", async () => {
		await db.exec("DROP TABLE handovers; DROP TABLE item_subtasks");
		expect(await findRetiredTables(pgliteExecutor(db))).toEqual([]);
	});
});
