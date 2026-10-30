import { extensionStorage } from "./extensionStorage";

const LAST_REPO_KEY = "lastRepo";

export const lastAssistRepo = {
	async load(): Promise<string | undefined> {
		const stored = await extensionStorage()
			?.get(LAST_REPO_KEY)
			.catch(() => undefined);
		const value = stored?.[LAST_REPO_KEY];
		return typeof value === "string" ? value : undefined;
	},
	save(repo: string): void {
		void extensionStorage()
			?.set({ [LAST_REPO_KEY]: repo })
			.catch(() => undefined);
	},
};
