import { CardToggle } from "../../../../../../CardToggle";
import { sessionToggles } from "../../../../../../sessionToggles";
import { toggleSetter } from "../../../../../../toggleSetter";
import type { SessionInfo } from "../../../../../../../types";

export function SessionTopBarToggles({
	session,
	onSetAutoStart,
	onSetAutoAdvance,
}: {
	session: SessionInfo;
	onSetAutoStart: (enabled: boolean) => void;
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
						onSetAutoStart,
						onSetAutoAdvance,
					})}
				/>
			))}
		</>
	);
}
