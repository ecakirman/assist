import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestDb } from "../../shared/db/createTestDb";
import type { Db } from "../../shared/db/Db";
import { comments, items } from "../../shared/db/schema";
import { comment } from "./comment";

let orm: Db;
let close: () => Promise<void>;

const mockRequestPreviewDecision = vi.fn();

vi.mock("../../shared/db/getDb", () => ({
	getDb: () => Promise.resolve(orm),
}));

vi.mock("./ensureRemoteOrigin", () => ({
	ensureRemoteOrigin: () => true,
}));

vi.mock("../sessions/shared/requestPreviewDecision", () => ({
	requestPreviewDecision: (...args: unknown[]) =>
		mockRequestPreviewDecision(...args),
}));

vi.mock("./shared", () => ({
	getOrigin: () => "test",
	findOneItem: () => ({
		orm,
		item: { id: 1, name: "Preview items", type: "story", status: "todo" },
	}),
}));

function getComments() {
	return orm
		.select({ text: comments.text, type: comments.type })
		.from(comments)
		.where(eq(comments.itemId, 1));
}

beforeEach(async () => {
	({ orm, close } = await createTestDb());
	await orm
		.insert(items)
		.values({ id: 1, origin: "test", name: "Preview items", status: "todo" });
	mockRequestPreviewDecision.mockReset();
	vi.spyOn(console, "log").mockImplementation(() => {});
	delete process.env.ASSIST_SESSION;
	delete process.env.ASSIST_SESSION_ID;
});

afterEach(async () => {
	await close();
	vi.restoreAllMocks();
	delete process.env.ASSIST_SESSION;
	delete process.env.ASSIST_SESSION_ID;
});

describe("comment", () => {
	it("appends the comment outside a web session", async () => {
		await comment("a1", "Looks good to me");

		expect(await getComments()).toEqual([
			{ text: "Looks good to me", type: "comment" },
		]);
	});

	it("appends the comment without a preview in a web session", async () => {
		process.env.ASSIST_SESSION = "1";
		process.env.ASSIST_SESSION_ID = "7";

		await comment("a1", "Looks good to me");

		expect(mockRequestPreviewDecision).not.toHaveBeenCalled();
		expect(await getComments()).toEqual([
			{ text: "Looks good to me", type: "comment" },
		]);
	});
});
