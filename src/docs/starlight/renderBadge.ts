const homeOutlinedPath =
	"m12 5.69 5 4.5V18h-2v-6H9v6H7v-7.81zM12 3 2 12h3v8h6v-6h2v6h6v-8h3z";

const badges: Record<string, string> = {
	clone: `<span class="assist-badge assist-badge-clone" title="Clone"><svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="${homeOutlinedPath}"/></svg></span>`,
	harness:
		'<span class="assist-badge assist-chip assist-chip-outlined assist-chip-secondary">Codex</span>',
	serving:
		'<span class="assist-badge assist-chip assist-chip-filled assist-chip-success">serving :5173</span>',
	node: '<span class="assist-badge assist-chip assist-chip-outlined assist-chip-info">laptop</span>',
	internal:
		'<span class="assist-badge assist-chip assist-chip-outlined assist-chip-warning" title="Called by assist itself, not run by hand">internal</span>',
	experimental:
		'<span class="assist-badge assist-chip assist-chip-outlined assist-chip-error" title="Still in development and may change or be removed">experimental</span>',
};

export function renderBadge(badge: string): string {
	const html = badges[badge];
	if (!html)
		throw new Error(
			`Unknown :badge[${badge}], expected one of ${Object.keys(badges).join(", ")}`,
		);
	return html;
}
