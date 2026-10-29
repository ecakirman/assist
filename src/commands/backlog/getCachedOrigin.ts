import { resolveCurrentOrigin } from "./getCurrentOrigin";

const stableOrigins = new Map<string, string>();

export function getCachedOrigin(cwd: string): string {
	const cached = stableOrigins.get(cwd);
	if (cached !== undefined) return cached;
	const { origin, stable } = resolveCurrentOrigin(cwd);
	if (stable) stableOrigins.set(cwd, origin);
	return origin;
}
