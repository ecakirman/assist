import type { ProjectPaneItem } from "./projectPaneItem";

export function paneItemIsPull({
	owner,
	repo,
	number,
}: ProjectPaneItem): boolean {
	return (
		document.querySelector(`a[href$="/${owner}/${repo}/pull/${number}" i]`) !==
		null
	);
}
