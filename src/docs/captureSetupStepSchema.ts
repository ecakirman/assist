import { z } from "zod";

export const captureRepos = ["sandbox", "api", "website"] as const;

const scriptedConversation = {
	repo: z.enum(captureRepos),
	prompt: z.string().min(1),
	title: z.string().min(1).optional(),
	reply: z.array(z.string()).optional(),
};

const sessionStepSchema = z.strictObject({
	...scriptedConversation,
	status: z.enum(["running", "waiting", "done"]).optional(),
	edits: z.record(z.string().min(1), z.string()).optional(),
});

const transcriptStepSchema = z.strictObject({
	...scriptedConversation,
	ageMinutes: z.number().int().nonnegative().optional(),
});

export const captureSetupStepSchema = z.union([
	z.strictObject({ assist: z.array(z.string().min(1)).min(1) }),
	z.strictObject({ run: z.string().min(1) }),
	z.strictObject({ session: sessionStepSchema }),
	z.strictObject({ transcript: transcriptStepSchema }),
]);

export type CaptureSetupStep = z.infer<typeof captureSetupStepSchema>;
export type CaptureSessionStep = z.infer<typeof sessionStepSchema>;
export type CaptureTranscriptStep = z.infer<typeof transcriptStepSchema>;
