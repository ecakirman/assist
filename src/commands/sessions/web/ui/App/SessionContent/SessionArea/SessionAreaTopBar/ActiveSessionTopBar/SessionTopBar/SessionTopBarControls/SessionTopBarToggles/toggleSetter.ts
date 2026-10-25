import type { SessionToggle } from "../../../../../../../sessionToggles";

type ToggleSetters = {
	onSetAutoApprove: (enabled: boolean) => void;
	onSetAutoAdvance: (enabled: boolean) => void;
};

export function toggleSetter(
	key: SessionToggle["key"],
	setters: ToggleSetters,
): (enabled: boolean) => void {
	return key === "autoApprove"
		? setters.onSetAutoApprove
		: setters.onSetAutoAdvance;
}
