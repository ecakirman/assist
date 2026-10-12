import type { ReleaseChange } from "../../../../../../../releases/types";

const SHORT_SHA = 7;

export function changeRef(repo: string, change: ReleaseChange) {
	if (change.pr) return { href: change.pr.url, label: `#${change.pr.number}` };
	return {
		href: `https://github.com/${repo}/commit/${change.sha}`,
		label: change.sha.slice(0, SHORT_SHA),
	};
}
