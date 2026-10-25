import { openDocsFeedback } from "./openDocsFeedback";
import { readDocsSelection } from "./readDocsSelection";

const OWN_UI = "[data-assist-docs-feedback], [data-assist-popover]";

function isOwnUi(target: EventTarget | null): boolean {
	return target instanceof Element && target.closest(OWN_UI) !== null;
}

function popoverOpen(): boolean {
	return document.querySelector("[data-assist-popover]") !== null;
}

export function watchDocsSelection(): void {
	let release: (() => void) | undefined;
	document.addEventListener("mouseup", (event) => {
		if (isOwnUi(event.target) || popoverOpen()) return;
		release?.();
		release = undefined;
		const selection = readDocsSelection(document, globalThis.getSelection());
		if (selection) release = openDocsFeedback(selection);
	});
}
