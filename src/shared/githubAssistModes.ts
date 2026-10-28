export const githubAssistModes = {
	draft: ["draft", "--once"],
	bug: ["bug", "--once"],
} satisfies Record<string, string[]>;

export type GithubAssistMode = keyof typeof githubAssistModes;

export function isGithubAssistMode(mode: unknown): mode is GithubAssistMode {
	return typeof mode === "string" && Object.hasOwn(githubAssistModes, mode);
}
