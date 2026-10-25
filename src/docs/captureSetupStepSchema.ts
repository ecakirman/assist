import { z } from "zod";

export const captureRepos = ["sandbox", "api", "website"] as const;

const sessionStepSchema = z.strictObject({
	repo: z.enum(captureRepos),
	prompt: z.string().min(1),
	title: z.string().min(1).optional(),
	reply: z.array(z.string()).optional(),
	status: z.enum(["running", "waiting", "done"]).optional(),
});

export const captureSetupStepSchema = z.union([
	z.strictObject({ assist: z.array(z.string().min(1)).min(1) }),
	z.strictObject({ run: z.string().min(1) }),
	z.strictObject({ session: sessionStepSchema }),
]);

export type CaptureSetupStep = z.infer<typeof captureSetupStepSchema>;
export type CaptureSessionStep = z.infer<typeof sessionStepSchema>;
