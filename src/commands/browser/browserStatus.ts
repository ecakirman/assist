import { requestTab } from "./requestTab";

export async function browserStatus(options: {
	url?: string;
	server: string;
}): Promise<void> {
	const result = await requestTab(options.server, {
		op: "status",
		url: options.url,
	});
	console.log(`extension: connected (v${result.version})`);
	console.log(
		`content script: ${result.contentScript ? "running" : "not running (reload the tab, or update the extension)"}`,
	);
}
