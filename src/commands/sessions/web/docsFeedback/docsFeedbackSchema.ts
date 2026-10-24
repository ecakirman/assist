import { z } from "zod";

export const docsFeedbackSchema = z.object({
	sessionId: z.string().optional(),
	pageId: z.string().min(1),
	heading: z.string().min(1),
	source: z.string().min(1),
	selection: z.string().min(1),
	prompt: z.string().trim().min(1),
});

export type DocsFeedback = z.infer<typeof docsFeedbackSchema>;
