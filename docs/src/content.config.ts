import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { createDocsFrontmatterCheck } from "../../src/docs/starlight/createDocsFrontmatterCheck";

const findProblems = createDocsFrontmatterCheck();

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: (context) =>
			z.preprocess((frontmatter, ctx) => {
				for (const message of findProblems(frontmatter))
					ctx.addIssue({ code: "custom", message });
				return frontmatter;
			}, docsSchema()(context).loose()),
	}),
};
