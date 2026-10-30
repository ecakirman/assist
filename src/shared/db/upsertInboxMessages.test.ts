import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestDb } from "./createTestDb";
import type { Db } from "./Db";
import { inboxMessages } from "./inboxMessages";
import { listInboxMessages } from "./listInboxMessages";
import { upsertInboxMessages } from "./upsertInboxMessages";

const message = (messageId: string, receivedAt: string) => ({
	source: "gmail",
	messageId,
	sender: "Alex",
	summary: "Asks for a review",
	link: `https://mail.google.com/${messageId}`,
	receivedAt: new Date(receivedAt),
});

describe("upsertInboxMessages", () => {
	let orm: Db;
	let close: () => Promise<void>;

	beforeEach(async () => {
		({ orm, close } = await createTestDb());
		await orm.delete(inboxMessages);
	});

	afterEach(async () => {
		await close();
	});

	it("does not duplicate a message flagged again", async () => {
		expect(
			await upsertInboxMessages(orm, [message("m1", "2026-10-01T00:00:00Z")]),
		).toBe(1);
		expect(
			await upsertInboxMessages(orm, [
				message("m1", "2026-10-01T00:00:00Z"),
				message("m2", "2026-10-02T00:00:00Z"),
			]),
		).toBe(1);
		expect(await orm.select().from(inboxMessages)).toHaveLength(2);
	});

	it("keys on source as well as message id", async () => {
		await upsertInboxMessages(orm, [
			message("m1", "2026-10-01T00:00:00Z"),
			{ ...message("m1", "2026-10-01T00:00:00Z"), source: "slack" },
		]);
		expect(await orm.select().from(inboxMessages)).toHaveLength(2);
	});

	it("lists undismissed messages newest first", async () => {
		await upsertInboxMessages(orm, [
			message("old", "2026-10-01T00:00:00Z"),
			message("new", "2026-10-03T00:00:00Z"),
			{ ...message("gone", "2026-10-04T00:00:00Z"), dismissedAt: new Date() },
		]);
		expect((await listInboxMessages(orm)).map((m) => m.messageId)).toEqual([
			"new",
			"old",
		]);
	});
});
