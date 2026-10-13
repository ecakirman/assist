import { useState } from "react";
import {
	loadPersisted,
	prunePersisted,
	savePersisted,
} from "../../../../../loadPersisted";

const PREFIX = "assist:high-level-tree:";
const NONE: ReadonlySet<string> = new Set();

export function useHighLevelCollapse(
	subject: string,
	defaults: ReadonlySet<string> = NONE,
): {
	collapsed: Set<string>;
	onToggle: (path: string) => void;
} {
	const key = `${PREFIX}${subject}`;
	const [overrides, setOverrides] = useState(() => {
		prunePersisted(PREFIX);
		return new Set(loadPersisted<string>(key));
	});

	return {
		collapsed: toggled(defaults, overrides),
		onToggle: (path: string) => {
			const next = toggled(overrides, [path]);
			savePersisted(key, [...next]);
			setOverrides(next);
		},
	};
}

function toggled(base: Iterable<string>, flips: Iterable<string>): Set<string> {
	const result = new Set(base);
	for (const path of flips) if (!result.delete(path)) result.add(path);
	return result;
}
