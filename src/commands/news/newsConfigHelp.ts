import type { ConfigHelpEntry } from "../../shared/configHelp";

export const newsConfigHelp: ConfigHelpEntry[] = [
	{
		key: "news.showInNav",
		setter: "assist config set news.showInNav true",
		note: "show the News tab in the web UI top nav (default false); /news stays reachable by URL either way",
	},
	{
		key: "news.feeds",
		setter: "assist config set news.feeds <url1>,<url2>",
		note: "RSS feed URLs shown on the News page; stored in the database so every machine shares them (assist news add/list/remove edit the same list)",
	},
];
