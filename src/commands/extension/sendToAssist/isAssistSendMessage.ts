import {
	type GithubAssistMode,
	isGithubAssistMode,
} from "../../../shared/githubAssistModes";

export type AssistSendMessage = {
	type: "assist-send";
	url: string;
	instructions?: string;
	args?: string[];
	mode?: GithubAssistMode;
	repo?: string;
};

export type AssistSendRequest = Omit<AssistSendMessage, "type" | "url">;

export type AssistSendResult = { ok: boolean; message: string };

export function isAssistSendMessage(
	message: unknown,
): message is AssistSendMessage {
	const { type, url, args, mode, repo } = (message ?? {}) as Record<
		string,
		unknown
	>;
	return (
		type === "assist-send" &&
		typeof url === "string" &&
		(args === undefined ||
			(Array.isArray(args) && args.every((arg) => typeof arg === "string"))) &&
		(mode === undefined || isGithubAssistMode(mode)) &&
		(repo === undefined || typeof repo === "string")
	);
}
