import type { ReviewCiSlot } from "./parseSlot";
import type { ReviewCiConfig } from "./readReviewCiEnv";

function formatSlot(slot: ReviewCiSlot): string {
	return `\`${slot.harness}:${slot.model}\``;
}

export function buildCiFooter(slots: ReviewCiConfig["slots"]): string {
	return [
		"---",
		"",
		`Models: reviewer 1 ${formatSlot(slots.claude)}, reviewer 2 ${formatSlot(slots.codex)}, synthesis ${formatSlot(slots.synthesis)}.`,
		"",
		"To re-run this review, mark the PR as draft and then ready for review again.",
	].join("\n");
}
