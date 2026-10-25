import { existsSync, readFileSync } from "node:fs";
import { z } from "zod";
import { captureSetupStepSchema } from "./captureSetupStepSchema";

const captureScenesSchema = z.record(
	z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	z.array(captureSetupStepSchema).min(1),
);

export type CaptureScenes = z.infer<typeof captureScenesSchema>;

export function loadCaptureScenes(file: string): CaptureScenes {
	if (!existsSync(file)) return {};
	const result = captureScenesSchema.safeParse(
		JSON.parse(readFileSync(file, "utf8")),
	);
	if (!result.success)
		throw new Error(`${file}:\n${z.prettifyError(result.error)}`);
	return result.data;
}
