import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import type { CaptureNewsFeed } from "../captureSetupStepSchema";
import type { CaptureHome } from "./createCaptureHome";
import { newsFeedXml } from "./newsFeedXml";
import { runAssist } from "./runAssist";

async function feedServerOrigin(capture: CaptureHome): Promise<string> {
	if (!capture.feedServer) {
		const server = createServer((request, response) => {
			const name = request.url?.match(/^\/([a-z0-9-]+)\.xml$/)?.[1];
			const feed = name ? capture.newsFeeds.get(name) : undefined;
			if (!feed) {
				response.writeHead(404).end();
				return;
			}
			response.writeHead(200, { "content-type": "application/rss+xml" });
			response.end(newsFeedXml(feed));
		});
		await new Promise<void>((resolve) =>
			server.listen(0, "127.0.0.1", resolve),
		);
		capture.feedServer = server;
	}
	const { port } = capture.feedServer.address() as AddressInfo;
	return `http://127.0.0.1:${port}`;
}

export async function addNewsFeed(
	capture: CaptureHome,
	feed: CaptureNewsFeed,
): Promise<void> {
	capture.newsFeeds.set(feed.name, feed);
	const origin = await feedServerOrigin(capture);
	runAssist(capture, ["news", "add", `${origin}/${feed.name}.xml`]);
}
