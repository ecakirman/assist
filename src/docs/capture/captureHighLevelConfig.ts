import {
	type HighLevelConfig,
	resolveHighLevelConfig,
} from "../../commands/review/highLevel/resolveHighLevelConfig";
import { assistConfigSchema } from "../../shared/types";
import type { CaptureHighLevelReviewStep } from "../captureSetupStepSchema";

export function captureHighLevelConfig(
	step: CaptureHighLevelReviewStep,
): HighLevelConfig {
	const highLevel = {
		...(step.criticalPaths ? { criticalPaths: step.criticalPaths } : {}),
		...(step.uiPaths ? { uiPaths: step.uiPaths } : {}),
	};
	return resolveHighLevelConfig(
		assistConfigSchema.parse({ review: { highLevel } }),
	);
}
