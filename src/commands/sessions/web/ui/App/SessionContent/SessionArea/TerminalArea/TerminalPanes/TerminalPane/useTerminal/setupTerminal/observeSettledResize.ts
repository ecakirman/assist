const RESIZE_SETTLE_MS = 100;

export function observeSettledResize(
	el: HTMLElement,
	onSettled: () => void,
): () => void {
	let timer: ReturnType<typeof setTimeout> | undefined;
	const observer = new ResizeObserver(() => {
		clearTimeout(timer);
		timer = setTimeout(onSettled, RESIZE_SETTLE_MS);
	});
	observer.observe(el);
	return () => {
		clearTimeout(timer);
		observer.disconnect();
	};
}
