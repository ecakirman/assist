import { isAssistSendMessage } from "./isAssistSendMessage";
import { extensionRuntime } from "./extensionRuntime";
import { postToAssist } from "./postToAssist";

const SERVER = "http://localhost:3100";

export function assistBackground(): void {
	extensionRuntime()?.onMessage.addListener((message) => {
		if (!isAssistSendMessage(message)) return undefined;
		return postToAssist(SERVER, message);
	});
}

assistBackground();
