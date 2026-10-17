import { randomUUID } from "node:crypto";
import chalk from "chalk";
import { renderMarkdownTerminal } from "../../../shared/renderMarkdownTerminal";
import { awaitPreviewApproval } from "../../sessions/shared/awaitPreviewApproval";
import { formatItemId } from "../formatItemId";
import type { BacklogItem } from "../types";
import type { PlanUpdatePhase } from "./planUpdateSchema";
import { renderPlanUpdate } from "./renderPlanUpdate";

type PlanUpdateApproval = { autostart: boolean };

export async function reviewPlanUpdate(
	item: BacklogItem,
	phases: PlanUpdatePhase[],
): Promise<PlanUpdateApproval> {
	const body = renderPlanUpdate(item, phases);
	const sessionId = process.env.ASSIST_SESSION_ID;

	if (process.env.ASSIST_SESSION === "1" && sessionId) {
		const decision = await awaitPreviewApproval("Plan update preview", {
			sessionId,
			requestId: randomUUID(),
			title: `Update the plan for ${formatItemId(item.id)}: ${item.name}`,
			body,
			prNumber: null,
			kind: "backlog-item",
			itemType: item.type,
			canStart: true,
		});
		return { autostart: decision.autostart === true };
	}

	console.log(chalk.bold(item.name));
	console.log(renderMarkdownTerminal(body));
	return { autostart: false };
}
