import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { NodeSelection } from "../../../useNodeSelection";
import { fetchNodeUpdate } from "../fetchNodeUpdate";
import type { NodeUpdateEntry, NodeUpdates } from "../NodeUpdateEntry";

const POLL_MS = 60_000;

function seedEntries(
	prev: NodeUpdateEntry[],
	names: string[],
	local: string | undefined,
): NodeUpdateEntry[] {
	return names.map(
		(name) =>
			prev.find((e) => e.name === name) ?? {
				name,
				local: name === local,
				loading: true,
			},
	);
}

export function useNodeUpdates(selection: NodeSelection): NodeUpdates {
	const local = selection.nodes?.local;
	const namesKey = selection.names.join("\n");
	const [entries, setEntries] = useState<NodeUpdateEntry[]>([]);
	const generation = useRef(0);

	const refresh = useCallback(() => {
		const names = namesKey ? namesKey.split("\n") : [];
		if (names.length === 0) return;
		const current = ++generation.current;
		setEntries((prev) => seedEntries(prev, names, local));
		for (const name of names) {
			void fetchNodeUpdate(name, name === local).then((next) => {
				if (current !== generation.current) return;
				setEntries((prev) => prev.map((e) => (e.name === name ? next : e)));
			});
		}
	}, [namesKey, local]);

	useEffect(() => {
		refresh();
		const id = setInterval(refresh, POLL_MS);
		return () => clearInterval(id);
	}, [refresh]);

	const loading = entries.length === 0;
	return useMemo(
		() => ({ entries, loading, refresh }),
		[entries, loading, refresh],
	);
}
