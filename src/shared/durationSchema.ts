import { z } from "zod";
import { parseDuration } from "./parseDuration";

export const durationSchema = z.string().superRefine((value, ctx) => {
	try {
		parseDuration(value);
	} catch (error) {
		ctx.addIssue({ code: "custom", message: (error as Error).message });
	}
});
