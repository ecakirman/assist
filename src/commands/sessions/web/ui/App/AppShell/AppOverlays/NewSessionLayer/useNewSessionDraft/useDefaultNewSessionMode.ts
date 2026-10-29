import { useEffect, useState } from "react";
import { useRepoSelectionContext } from "../../../../../useRepoSelectionContext";
import { type NewSessionMode, newSessionModes } from "../newSessionModes";

export type LoadedDefaultMode = { mode: NewSessionMode; pending: boolean };

type LoadedModes = { open: boolean; byCwd: Record<string, NewSessionMode> };

async function fetchModes(
	cwds: string[],
): Promise<Record<string, NewSessionMode>> {
	try {
		const query = cwds.map((cwd) => `cwd=${encodeURIComponent(cwd)}`);
		const res = await fetch(`/api/new-session-defaults?${query.join("&")}`);
		const body = await res.json();
		return Object.fromEntries(
			Object.entries(body?.modes ?? {}).filter(([, mode]) =>
				Object.hasOwn(newSessionModes, mode as string),
			),
		) as Record<string, NewSessionMode>;
	} catch {
		return {};
	}
}

export function useDefaultNewSessionMode(
	cwd: string,
	open = false,
): LoadedDefaultMode | null {
	const { repos } = useRepoSelectionContext();
	const cwdsKey = JSON.stringify([...new Set([...repos, cwd])]);
	const [loaded, setLoaded] = useState<LoadedModes | null>(null);

	useEffect(() => {
		let cancelled = false;
		void (async () => {
			const byCwd = await fetchModes(JSON.parse(cwdsKey));
			if (!cancelled) setLoaded({ open, byCwd });
		})();
		return () => {
			cancelled = true;
		};
	}, [open, cwdsKey]);

	if (!loaded) return null;
	const mode = loaded.byCwd[cwd];
	return {
		mode: mode ?? "draft",
		pending: mode === undefined || loaded.open !== open,
	};
}
