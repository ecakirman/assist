export function watchGithubPage(attach: () => void): void {
	attach();
	new MutationObserver(attach).observe(document.documentElement, {
		childList: true,
		subtree: true,
	});
}
