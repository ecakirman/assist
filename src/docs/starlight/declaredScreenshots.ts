import { docsScreenshotsSchema } from "../docsPageSchema";

type PluginContext = {
	fileURL: URL | undefined;
	data: { astro?: { frontmatter?: { screenshots?: unknown } } };
};

export function declaredScreenshots(data: PluginContext["data"]) {
	const result = docsScreenshotsSchema.safeParse(
		data.astro?.frontmatter?.screenshots,
	);
	return new Map((result.data ?? []).map((shot) => [shot.file, shot]));
}
