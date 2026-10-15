import { type RefObject, useEffect, useState } from "react";
import { highLevelCheckDomId, JUMP_TARGET_OFFSET } from "./highLevelCheckDomId";

function atBottom(container: HTMLElement): boolean {
	const { scrollTop, scrollHeight, clientHeight } = container;
	return (
		scrollHeight > clientHeight && scrollTop + clientHeight >= scrollHeight - 1
	);
}

function activeCheck(container: HTMLElement, ids: string[]) {
	if (atBottom(container)) return ids.at(-1);
	const line = container.getBoundingClientRect().top + JUMP_TARGET_OFFSET + 1;
	let current = ids[0];
	for (const id of ids) {
		const row = document.getElementById(highLevelCheckDomId(id));
		if (row && row.getBoundingClientRect().top <= line) current = id;
	}
	return current;
}

export function useHighLevelJumpSpy(
	containerRef: RefObject<HTMLElement | null>,
	ids: string[],
): string | undefined {
	const key = ids.join("|");
	const [activeId, setActiveId] = useState<string | undefined>(ids[0]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || !key) return;
		const keyIds = key.split("|");
		const update = () => setActiveId(activeCheck(container, keyIds));
		update();
		container.addEventListener("scroll", update, { passive: true });
		return () => container.removeEventListener("scroll", update);
	}, [containerRef, key]);

	return activeId;
}
