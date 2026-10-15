import { extensionStorage } from "./extensionStorage";
import { normalizeServerUrl } from "./normalizeServerUrl";

const DEFAULT_ASSIST_SERVER = "http://localhost:3100";
export const SERVER_URL_KEY = "serverUrl";

export async function assistServerUrl(): Promise<string> {
	const stored = await extensionStorage()
		?.get(SERVER_URL_KEY)
		.catch(() => undefined);
	const value = stored?.[SERVER_URL_KEY];
	return (
		(typeof value === "string" && normalizeServerUrl(value)) ||
		DEFAULT_ASSIST_SERVER
	);
}
