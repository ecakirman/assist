import { connectBrowserLink } from "../browserLink/connectBrowserLink";
import { isDocsFeedbackMessage } from "../docsFeedback/isDocsFeedbackMessage";
import { postDocsFeedback } from "../docsFeedback/postDocsFeedback";
import { assistServerUrl } from "./assistServerUrl";
import { isAssistSendMessage } from "./isAssistSendMessage";
import { extensionRuntime } from "./extensionRuntime";
import { postToAssist } from "./postToAssist";

export function assistBackground(): void {
	extensionRuntime()?.onMessage.addListener((message) => {
		if (isAssistSendMessage(message))
			return assistServerUrl().then((server) => postToAssist(server, message));
		if (isDocsFeedbackMessage(message))
			return assistServerUrl().then((server) =>
				postDocsFeedback(server, message),
			);
		return undefined;
	});
}

assistBackground();
connectBrowserLink();
