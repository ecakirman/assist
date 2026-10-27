import { z } from "zod";
import { captureSetupStepSchema } from "./captureSetupStepSchema";

export const docsNavGroups = [
	"Getting started",
	"Sessions",
	"Backlog",
	"Activity",
	"Git and GitHub",
	"Repo tooling",
	"Integrations",
	"CLI",
	"Contributing",
] as const;

const actionSchema = z.union([
	z.strictObject({ click: z.string().min(1) }),
	z.strictObject({ press: z.string().min(1) }),
	z.strictObject({ type: z.string().min(1) }),
	z.strictObject({
		drag: z.strictObject({ from: z.string().min(1), to: z.string().min(1) }),
	}),
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
	crop: z
		.union([z.string().min(1), z.array(z.string().min(1)).min(2)])
		.optional(),
	cropPadding: z.number().int().positive().optional(),
	scene: z.string().min(1).optional(),
	setup: z.array(captureSetupStepSchema).optional(),
	actions: z.array(actionSchema).optional(),
	highlight: z.array(z.string().min(1)).optional(),
});

export const docsScreenshotsSchema = z.array(screenshotSchema).optional();

export const docsPageSchema = z.strictObject({
	id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	title: z.string().min(1),
	group: z.enum(docsNavGroups),
	order: z.number().int(),
	covers: z.array(z.string().min(1)),
	screenshots: docsScreenshotsSchema,
});

export type DocsPage = z.infer<typeof docsPageSchema> & {
	source?: string;
	body?: string;
};
export type DocsScreenshot = NonNullable<DocsPage["screenshots"]>[number];
export type DocsScreenshotAction = NonNullable<
	DocsScreenshot["actions"]
>[number];
