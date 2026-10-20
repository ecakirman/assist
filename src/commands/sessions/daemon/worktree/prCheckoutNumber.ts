const CHECKOUT_COMMANDS = new Set([
	"review",
	"review-pr-comments",
	"fix-conflict",
]);

export function prCheckoutNumber(args: string[]): string | undefined {
	const [command, ...rest] = args;
	if (!command || !CHECKOUT_COMMANDS.has(command)) return undefined;
	return rest.find((arg) => /^[1-9]\d*$/.test(arg));
}
