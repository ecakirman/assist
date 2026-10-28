import type { ReactNode } from "react";
import type { GithubAssistMode } from "../../../shared/githubAssistModes";
import { AssistPopover } from "./AssistPopover";
import { AssistReviewMenu } from "./AssistReviewMenu";

export type AssistSendRequest = {
	instructions?: string;
	args?: string[];
	mode?: GithubAssistMode;
};

const sendModes: { label: string; mode?: GithubAssistMode }[] = [
	{ label: "Prompt" },
	{ label: "Draft", mode: "draft" },
	{ label: "Bug", mode: "bug" },
];

export type AssistPopoverKind =
	| "instructions"
	| "review"
	| "azure-devops-review";

export function assistPopoverContent(
	kind: AssistPopoverKind,
	{
		send,
		dismiss,
	}: {
		send: (request: AssistSendRequest) => void;
		dismiss: (restoreFocus: boolean) => void;
	},
): ReactNode {
	if (kind !== "instructions")
		return (
			<AssistReviewMenu
				actionsOnly={kind === "azure-devops-review"}
				onPick={(args) => {
					dismiss(false);
					send({ args });
				}}
				onClose={dismiss}
			/>
		);
	return (
		<AssistPopover
			buttons={sendModes.map(({ label }) => label)}
			onSend={(instructions, button) => {
				dismiss(false);
				const { mode } = sendModes[button];
				send({
					instructions: instructions || undefined,
					...(mode && { mode }),
				});
			}}
			onClose={dismiss}
		/>
	);
}
