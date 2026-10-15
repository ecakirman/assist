import type { GitRef } from "../../commands/backlog/types";
import { resolveSessionItemId } from "../resolveSessionItemId";
import { closeDb, getDb } from "./getDb";
import { recordGitRef } from "./recordGitRef";

type RecordSessionRefsResult =
	| { status: "no-session" }
	| { status: "recorded"; itemId: number }
	| { status: "failed"; itemId: number; error: unknown };

export async function recordSessionRefs(
	refs: GitRef[],
): Promise<RecordSessionRefsResult> {
	const itemId = resolveSessionItemId();
	if (itemId === null) return { status: "no-session" };
	if (refs.length === 0) return { status: "recorded", itemId };
	const result = await persist(itemId, refs).then(
		(): RecordSessionRefsResult => ({ status: "recorded", itemId }),
		(error: unknown): RecordSessionRefsResult => ({
			status: "failed",
			itemId,
			error,
		}),
	);
	await closeDb().catch(ignore);
	return result;
}

async function persist(itemId: number, refs: GitRef[]): Promise<void> {
	const db = await getDb();
	for (const ref of refs) {
		await recordGitRef(db, itemId, ref);
	}
}

function ignore(): void {}
