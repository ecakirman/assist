let held: HTMLElement | null = null;

export function holdFocus(element: HTMLElement): void {
	held = element;
	element.focus({ preventScroll: true });
}

export function isFocusHeld(): boolean {
	const doc = globalThis.document;
	if (doc.querySelector('[role="dialog"][aria-modal="true"]')) return true;
	return held !== null && doc.activeElement === held;
}
