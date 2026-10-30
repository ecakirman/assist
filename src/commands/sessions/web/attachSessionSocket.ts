import type { Server } from "node:http";
import { WebSocketServer } from "ws";
import { BROWSER_LINK_PATH } from "../../extension/browserLink/types";
import { browserLink } from "./browser/browserLink";
import { isExtensionOrigin } from "./fromGithub/isExtensionOrigin";
import { handleSocket, type RelayContext } from "./handleSocket";
import { onReleaseWebServerPort } from "./restartMenu/releaseWebServerPort";

export function attachSessionSocket(server: Server, ctx: RelayContext): void {
	const wss = new WebSocketServer({ noServer: true });

	server.on("upgrade", (req, socket, head) => {
		if (req.url === "/ws") {
			wss.handleUpgrade(req, socket, head, (ws) => {
				handleSocket(ws, ctx);
			});
		} else if (
			req.url === BROWSER_LINK_PATH &&
			isExtensionOrigin(req.headers.origin)
		) {
			wss.handleUpgrade(req, socket, head, (ws) => browserLink.attach(ws));
		} else {
			if (req.url === BROWSER_LINK_PATH)
				console.log(
					`browser link: refused origin ${req.headers.origin ?? "(none)"}`,
				);
			socket.destroy();
		}
	});

	onReleaseWebServerPort(() => {
		for (const client of wss.clients) client.terminate();
		server.close();
		server.closeAllConnections();
	});
}
