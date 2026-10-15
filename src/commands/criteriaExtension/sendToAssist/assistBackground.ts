import { assistServerUrl } from "./assistServerUrl";
import { isAssistSendMessage } from "./isAssistSendMessage";
import { extensionRuntime } from "./extensionRuntime";
import { postToAssist } from "./postToAssist";

export function assistBackground(): void {
	extensionRuntime()?.onMessage.addListener((message) => {
		if (!isAssistSendMessage(message)) return undefined;
		return assistServerUrl().then((server) => postToAssist(server, message));
	});
}

assistBackground();
