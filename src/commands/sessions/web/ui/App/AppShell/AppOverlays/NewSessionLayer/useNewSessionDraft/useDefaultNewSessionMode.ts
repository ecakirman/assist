import { useEffect, useRef, useState } from "react";
import { useRepoSelectionContext } from "../../../../../useRepoSelectionContext";
import { type NewSessionMode } from "../newSessionModes";
import { fetchModes } from "./useDefaultNewSessionMode/fetchModes";

export type LoadedDefaultMode = { mode: NewSessionMode; pending: boolean };

type LoadedModes = { open: boolean; byCwd: Record<string, NewSessionMode> };

const RETRY_MS = 1000;

export function useDefaultNewSessionMode(
	cwd: string,
	open = false,
): LoadedDefaultMode | null {
	const { repos } = useRepoSelectionContext();
	const cwds = useRef<string[]>([]);
	cwds.current = [...new Set([...repos, cwd])];
	const [loaded, setLoaded] = useState<LoadedModes | null>(null);
	const missing = loaded && !Object.hasOwn(loaded.byCwd, cwd) ? cwd : "";

	useEffect(() => {
		let cancelled = false;
		let retry: ReturnType<typeof setTimeout> | undefined;
		const load = async () => {
			const byCwd = await fetchModes(cwds.current);
			if (cancelled) return;
			if (!byCwd) {
				retry = setTimeout(load, RETRY_MS);
				return;
			}
			setLoaded((prev) => ({
				open,
				byCwd: prev?.open === open ? { ...prev.byCwd, ...byCwd } : byCwd,
			}));
		};
		void load();
		return () => {
			cancelled = true;
			clearTimeout(retry);
		};
	}, [open, missing]);

	if (!loaded) return null;
	const mode = loaded.byCwd[cwd];
	return {
		mode: mode ?? "draft",
		pending: mode === undefined || loaded.open !== open,
	};
}
