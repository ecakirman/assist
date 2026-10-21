import type { RunConfig } from "../../shared/types";

type RunParam = NonNullable<RunConfig["params"]>[number];

function fail(spec: string): never {
	console.error(
		`--param must be <name>, <name>! or <name>=<default>, got "${spec}"`,
	);
	process.exit(1);
}

function parseParamSpec(spec: string): RunParam {
	const eq = spec.indexOf("=");
	const name = eq === -1 ? spec : spec.slice(0, eq);
	if (eq !== -1) {
		if (eq === 0 || name.endsWith("!")) fail(spec);
		return { name, default: spec.slice(eq + 1) };
	}
	if (name.endsWith("!")) {
		if (name.length === 1) fail(spec);
		return { name: name.slice(0, -1), required: true };
	}
	if (name.length === 0) fail(spec);
	return { name };
}

export function parseParamSpecs(specs: string[]): RunParam[] | undefined {
	if (specs.length === 0) return undefined;
	return specs.map(parseParamSpec);
}
