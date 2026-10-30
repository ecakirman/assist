import { z } from "zod";

const flaggedMessageSchema = z.object({
	source: z.enum(["gmail", "slack"]),
	messageId: z.string().min(1),
	sender: z.string().min(1),
	summary: z.string().min(1),
	link: z.string().min(1),
	receivedAt: z.string().optional(),
});

export const inboxScanSchema = z.object({
	messages: z.array(flaggedMessageSchema),
});

export type FlaggedMessage = z.infer<typeof flaggedMessageSchema>;
