import { prActions } from "./prActions";
import { reviewButtonModes } from "./reviewButtonModes";
import { reviewOptionArgs, reviewOptionFlags } from "./reviewOptionFlags";

function sameArgs(a: readonly string[], b: readonly string[]): boolean {
	return a.length === b.length && a.every((arg, index) => arg === b[index]);
}

function isOptionFlags(flags: string[]): boolean {
	const options = Object.fromEntries(
		reviewOptionFlags.map(({ key, flag }) => [key, flags.includes(flag)]),
	) as Parameters<typeof reviewOptionArgs>[0];
	return sameArgs(flags, reviewOptionArgs(options));
}

export function isAllowedPrArgs(args: unknown): args is string[] {
	if (!Array.isArray(args)) return false;
	if (prActions.some((action) => sameArgs(action.args, args))) return true;
	return reviewButtonModes.some(
		(mode) =>
			sameArgs(mode.args, args.slice(0, mode.args.length)) &&
			isOptionFlags(args.slice(mode.args.length)),
	);
}
