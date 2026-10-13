import { CardToggle } from "../../../../../../CardToggle";
import { sessionToggles } from "../../../../../../sessionToggles";
import type { SessionInfo } from "../../../../../../../types";

export function SessionTopBarToggles({
	session,
	onSetAutoAdvance,
}: {
	session: SessionInfo;
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
					onChange={onSetAutoAdvance}
				/>
			))}
		</>
	);
}
