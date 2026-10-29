export function toggleHandlers(
	close: () => void,
	toggle: () => void,
	toggleDesign: () => void,
) {
	const thenClose = (action: () => void) => () => {
		action();
		close();
	};
	return {
		onToggleColorMode: thenClose(toggle),
		onToggleDesign: thenClose(toggleDesign),
	};
}
