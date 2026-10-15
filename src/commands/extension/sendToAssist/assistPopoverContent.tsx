import type { ReactNode } from "react";
import { AssistPopover } from "./AssistPopover";
import { AssistReviewMenu } from "./AssistReviewMenu";

export function assistPopoverContent(
	kind: "instructions" | "review",
	{
		send,
		dismiss,
	}: {
		send: (request: { instructions?: string; args?: string[] }) => void;
		dismiss: (restoreFocus: boolean) => void;
	},
): ReactNode {
	if (kind === "review")
		return (
			<AssistReviewMenu
				onPick={(args) => {
					dismiss(false);
					send({ args });
				}}
				onClose={dismiss}
			/>
		);
	return (
		<AssistPopover
			onSend={(instructions) => {
				dismiss(false);
				send({ instructions: instructions || undefined });
			}}
			onClose={dismiss}
		/>
	);
}
