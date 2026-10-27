import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { createDocsFrontmatterCheck } from "../../src/docs/starlight/createDocsFrontmatterCheck";

const findProblems = createDocsFrontmatterCheck();
const preview = process.env.NODE_ENV === "development";

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: (context) => {
			const page = docsSchema()(context).loose();
			const checked = z.preprocess((frontmatter, ctx) => {
				for (const message of findProblems(frontmatter))
					ctx.addIssue({ code: "custom", message });
				return frontmatter;
			}, page);
			if (!preview) return checked;
			return checked.catch(({ issues }) => ({
				...page.parse({ title: "Invalid frontmatter" }),
				previewError: z.prettifyError(new z.ZodError(issues)),
			}));
		},
	}),
};
