import type { SessionToggle } from "./sessionToggles";

type ToggleSetters = {
	onSetAutoStart: (enabled: boolean) => void;
	onSetAutoAdvance: (enabled: boolean) => void;
};

export function toggleSetter(
	key: SessionToggle["key"],
	setters: ToggleSetters,
): (enabled: boolean) => void {
	return key === "autoStart"
		? setters.onSetAutoStart
		: setters.onSetAutoAdvance;
}
