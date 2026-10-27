import type { CaptureNewsFeed } from "../captureSetupStepSchema";

const HOUR_MS = 3_600_000;

function escapeXml(text: string): string {
	return text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

function slug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

export function newsFeedXml(feed: CaptureNewsFeed, now = Date.now()): string {
	const items = feed.items.map(
		(item) => `<item>
<title>${escapeXml(item.title)}</title>
<link>https://example.com/${feed.name}/${slug(item.title)}</link>
<pubDate>${new Date(now - item.hoursAgo * HOUR_MS).toUTCString()}</pubDate>
${item.excerpt ? `<description>${escapeXml(item.excerpt)}</description>` : ""}
</item>`,
	);
	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${escapeXml(feed.title)}</title>
${items.join("\n")}
</channel></rss>`;
}
