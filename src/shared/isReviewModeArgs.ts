import { reviewButtonModes } from "./reviewButtonModes";

export function isReviewModeArgs(args: unknown): args is string[] {
	if (!Array.isArray(args)) return false;
	return reviewButtonModes.some(
		(mode) =>
			mode.args.length === args.length &&
			mode.args.every((arg, index) => arg === args[index]),
	);
}
