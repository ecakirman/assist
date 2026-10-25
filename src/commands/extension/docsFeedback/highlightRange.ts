const NAME = "assist-docs-feedback";

function ensureHighlightStyle(): void {
	if (document.getElementById(NAME)) return;
	const style = document.createElement("style");
	style.id = NAME;
	style.textContent = `::highlight(${NAME}) { background-color: Highlight; color: HighlightText; }`;
	document.head.append(style);
}

export function highlightRange(range: Range): () => void {
	const highlights = globalThis.CSS?.highlights;
	if (!highlights || typeof Highlight === "undefined") return () => {};
	ensureHighlightStyle();
	highlights.set(NAME, new Highlight(range));
	return () => highlights.delete(NAME);
}
