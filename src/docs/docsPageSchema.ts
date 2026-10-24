import { z } from "zod";

export const docsNavGroups = [
	"Getting started",
	"Sessions",
	"Backlog",
	"Activity",
	"Git and GitHub",
	"Repo tooling",
	"Integrations",
] as const;

const screenshotSchema = z.strictObject({
	file: z.string().regex(/^[a-z0-9-]+\.png$/),
	alt: z.string().min(1),
	route: z.string().startsWith("/"),
	viewport: z
		.strictObject({
			width: z.number().int().positive(),
			height: z.number().int().positive(),
		})
		.optional(),
	theme: z.enum(["light", "dark"]).optional(),
	waitFor: z.string().min(1).optional(),
	crop: z.string().min(1).optional(),
});

const sectionSchema = z.strictObject({
	heading: z.string().min(1),
	markdown: z.string().min(1),
	screenshots: z.array(screenshotSchema).optional(),
});

export const docsPageSchema = z.strictObject({
	id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	title: z.string().min(1),
	group: z.enum(docsNavGroups),
	order: z.number().int(),
	covers: z.array(z.string().min(1)),
	sections: z.array(sectionSchema).min(1),
});

export type DocsPage = z.infer<typeof docsPageSchema>;
