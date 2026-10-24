import { docsFeedbackButton } from "./docsFeedbackButton";
import { readDocsSelection } from "./readDocsSelection";

const OWN_UI = "[data-assist-docs-feedback], [data-assist-popover]";

function isOwnUi(target: EventTarget | null): boolean {
	return target instanceof Element && target.closest(OWN_UI) !== null;
}

function popoverOpen(): boolean {
	return document.querySelector("[data-assist-popover]") !== null;
}

export function watchDocsSelection(): void {
	let button: HTMLButtonElement | undefined;
	const clear = () => {
		button?.remove();
		button = undefined;
	};
	const show = (event: Event) => {
		if (isOwnUi(event.target) || popoverOpen()) return;
		clear();
		const selection = readDocsSelection(document, globalThis.getSelection());
		if (!selection) return;
		button = docsFeedbackButton(selection);
		document.body.append(button);
	};
	document.addEventListener("mouseup", show);
	document.addEventListener("keyup", show);
	document.addEventListener("selectionchange", () => {
		if (globalThis.getSelection()?.isCollapsed && !popoverOpen()) clear();
	});
}
