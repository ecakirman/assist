import type { IncomingMessage, ServerResponse } from "node:http";
import type { DocsChange } from "./watchDocsSources";

const endpoint = "/__reload";

const clientScript = `<script>
const source = new EventSource("${endpoint}");
let connected = false;
source.onopen = () => {
	if (connected) location.reload();
	connected = true;
};
source.onerror = () => {
	if (source.readyState !== EventSource.CLOSED) return;
	const retry = () =>
		fetch(location.href, { method: "HEAD" }).then(
			() => location.reload(),
			() => setTimeout(retry, 1000),
		);
	setTimeout(retry, 1000);
};
source.onmessage = (event) => {
	if (event.data !== "css") return location.reload();
	for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
		const url = new URL(link.href);
		url.searchParams.set("t", Date.now());
		link.href = url.href;
	}
};
</script>
`;

export function createLiveReload() {
	const clients = new Set<ServerResponse>();
	return {
		handle(req: IncomingMessage, res: ServerResponse): boolean {
			if (new URL(req.url ?? "/", "http://localhost").pathname !== endpoint)
				return false;
			res.writeHead(200, {
				"content-type": "text/event-stream",
				"cache-control": "no-cache",
				connection: "keep-alive",
			});
			res.write(": connected\n\n");
			clients.add(res);
			req.on("close", () => clients.delete(res));
			return true;
		},
		inject(html: string): string {
			return html.replace("</body>", `${clientScript}</body>`);
		},
		notify(change: DocsChange): void {
			for (const client of clients) client.write(`data: ${change}\n\n`);
		},
	};
}

export type LiveReload = ReturnType<typeof createLiveReload>;
