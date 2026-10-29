import { builtinDenyRules } from "./builtinDenyRules";

type HookDecision = {
	permissionDecision: "allow" | "deny";
	permissionDecisionReason: string;
};

function normaliseWhitespace(text: string): string {
	return text.replace(/\\\n/g, " ").replace(/\s+/g, " ");
}

function matchBuiltinDeny(text: string) {
	const normalised = normaliseWhitespace(text);
	return builtinDenyRules.find(
		(rule) => rule.matches(normalised) && (rule.enabled?.() ?? true),
	);
}

function toDecision(
	rule: { message: string } | undefined,
): HookDecision | undefined {
	if (!rule) return undefined;

	return {
		permissionDecision: "deny",
		permissionDecisionReason: rule.message,
	};
}

export function findBuiltinDeny(parts: string[]): HookDecision | undefined {
	for (const part of parts) {
		const decision = toDecision(matchBuiltinDeny(part));
		if (decision) return decision;
	}
	return undefined;
}

export function findBuiltinDenyRaw(
	rawCommand: string,
): HookDecision | undefined {
	return toDecision(matchBuiltinDeny(rawCommand));
}
