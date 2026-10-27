import { AddAgentButton } from "./SessionWorkspaceButtons/AddAgentButton";
import { OpenInCodeButton } from "../../OpenInCodeButton";
import type { SessionInfo } from "../../../types";

export function SessionWorkspaceButtons({ session }: { session: SessionInfo }) {
	return (
		<>
			<AddAgentButton session={session} shortcut="focusAddAgent" />
			{session.cwd && (
				<OpenInCodeButton
					cwd={session.cwd}
					variant="card"
					shortcut={session.commandType === "run" ? undefined : "focusVsCode"}
				/>
			)}
		</>
	);
}
