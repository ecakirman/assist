import { CardToggle } from "./SessionTopBarToggles/CardToggle";
import { sessionToggles } from "../../../../../../sessionToggles";
import { toggleSetter } from "./SessionTopBarToggles/toggleSetter";
import type { SessionInfo } from "../../../../../../../types";

export function SessionTopBarToggles({
	session,
	onSetAutoApprove,
	onSetAutoAdvance,
}: {
	session: SessionInfo;
	onSetAutoApprove: (enabled: boolean) => void;
	onSetAutoAdvance: (enabled: boolean) => void;
}) {
	return (
		<>
			{sessionToggles(session).map((toggle) => (
				<CardToggle
					key={toggle.key}
					inline
					label={toggle.label}
					checked={toggle.checked}
					onChange={toggleSetter(toggle.key, {
						onSetAutoApprove,
						onSetAutoAdvance,
					})}
				/>
			))}
		</>
	);
}
