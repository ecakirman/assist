import { z } from "zod";
import { captureSetupStepSchema } from "./captureSetupStepSchema";
import { screenshotPlaceholderPattern } from "./screenshotPlaceholder";

export const docsNavGroups = [
	"Getting started",
	"Sessions",
	"Backlog",
	"Activity",
	"Git and GitHub",
	"Repo tooling",
	"Integrations",
	"Contributing",
] as const;

const actionSchema = z.union([
	z.strictObject({ click: z.string().min(1) }),
	z.strictObject({ press: z.string().min(1) }),
]);

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
	scene: z.string().min(1).optional(),
	setup: z.array(captureSetupStepSchema).optional(),
	actions: z.array(actionSchema).optional(),
});

const sectionSchema = z
	.strictObject({
		heading: z.string().min(1),
		markdown: z.string().min(1),
		screenshots: z.array(screenshotSchema).optional(),
	})
	.superRefine((section, ctx) => {
		const declared = new Set(section.screenshots?.map((s) => s.file));
		for (const [, file] of section.markdown.matchAll(
			screenshotPlaceholderPattern,
		))
			if (!declared.has(file))
				ctx.addIssue({
					code: "custom",
					path: ["markdown"],
					message: `Placeholder for undeclared screenshot ${file}`,
				});
	});

export const docsPageSchema = z.strictObject({
	id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	title: z.string().min(1),
	group: z.enum(docsNavGroups),
	order: z.number().int(),
	covers: z.array(z.string().min(1)),
	sections: z.array(sectionSchema).min(1),
});

export type DocsPage = z.infer<typeof docsPageSchema> & { source?: string };
export type DocsScreenshot = NonNullable<
	DocsPage["sections"][number]["screenshots"]
>[number];
export type DocsScreenshotAction = NonNullable<
	DocsScreenshot["actions"]
>[number];
