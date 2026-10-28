import { azureDevopsPrActions } from "./azureDevopsPrActions";

export function isAllowedAzureDevopsPrArgs(args: unknown): args is string[] {
	if (!Array.isArray(args)) return false;
	return azureDevopsPrActions.some(
		(action) =>
			action.args.length === args.length &&
			action.args.every((arg, index) => arg === args[index]),
	);
}
