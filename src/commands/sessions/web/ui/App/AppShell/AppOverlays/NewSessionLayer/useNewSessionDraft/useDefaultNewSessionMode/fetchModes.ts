import { type NewSessionMode, newSessionModes } from "../../newSessionModes";

export async function fetchModes(
	cwds: string[],
): Promise<Record<string, NewSessionMode> | null> {
	try {
		const query = cwds.map((cwd) => `cwd=${encodeURIComponent(cwd)}`);
		const res = await fetch(`/api/new-session-defaults?${query.join("&")}`);
		const body = await res.json();
		if (!body?.modes) return null;
		return Object.fromEntries(
			Object.entries(body.modes).filter(([, mode]) =>
				Object.hasOwn(newSessionModes, mode as string),
			),
		) as Record<string, NewSessionMode>;
	} catch {
		return null;
	}
}
