import { highLevelCheckDomId } from "../../../../highLevelCheckDomId";

export function jumpToHighLevelCheck(id: string): void {
	const row = document.getElementById(highLevelCheckDomId(id));
	if (!row) return;
	const reduceMotion = globalThis.matchMedia?.(
		"(prefers-reduced-motion: reduce)",
	).matches;
	row.scrollIntoView?.({
		block: "start",
		behavior: reduceMotion ? "auto" : "smooth",
	});
	row
		.querySelector<HTMLInputElement>('input[type="checkbox"]')
		?.focus({ preventScroll: true });
}
