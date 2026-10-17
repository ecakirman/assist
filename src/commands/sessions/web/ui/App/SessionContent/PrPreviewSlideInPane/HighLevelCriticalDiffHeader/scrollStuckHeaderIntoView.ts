function hasSlidDownItsFile(header: HTMLElement, file: HTMLElement): boolean {
	return header.getBoundingClientRect().top > file.getBoundingClientRect().top;
}

export function scrollStuckHeaderIntoView(header: HTMLElement): void {
	const file = header.parentElement;
	if (!file || !hasSlidDownItsFile(header, file)) return;
	file.scrollIntoView?.({ block: "start" });
}
