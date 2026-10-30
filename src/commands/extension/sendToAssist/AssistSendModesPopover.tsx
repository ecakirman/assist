import { useState } from "react";
import type { GithubAssistMode } from "../../../shared/githubAssistModes";
import { AssistPopover } from "./AssistPopover";
import { AssistRepoPicker } from "./AssistRepoPicker";
import type { AssistSendRequest } from "./isAssistSendMessage";

const sendModes: { label: string; mode?: GithubAssistMode }[] = [
	{ label: "Prompt" },
	{ label: "Draft", mode: "draft" },
	{ label: "Bug", mode: "bug" },
];

export function AssistSendModesPopover({
	pickRepo,
	send,
	dismiss,
}: {
	pickRepo: boolean;
	send: (request: AssistSendRequest) => void;
	dismiss: (restoreFocus: boolean) => void;
}) {
	const [repo, setRepo] = useState("");
	return (
		<AssistPopover
			buttons={sendModes.map(({ label }) => label)}
			onSend={(instructions, button) => {
				dismiss(false);
				const { mode } = sendModes[button];
				send({
					instructions: instructions || undefined,
					...(mode && { mode }),
					...(pickRepo && { repo }),
				});
			}}
			onClose={dismiss}
		>
			{pickRepo && <AssistRepoPicker value={repo} onChange={setRepo} />}
		</AssistPopover>
	);
}
