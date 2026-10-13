import { useMemo, useState } from "react";
import { highLevelGlobMatches } from "./useHighLevelStructureMatch/highLevelGlobMatches";

export function useHighLevelStructureMatch(
	filePaths: string[],
	collapsedPaths: string[],
) {
	const [glob, setGlob] = useState("");
	const matches = useMemo(
		() => highLevelGlobMatches(filePaths, glob),
		[filePaths, glob],
	);
	const quickGlobs = useMemo(
		() => [...new Set(["**/*.md", ...collapsedPaths])],
		[collapsedPaths],
	);
	return { glob, onChangeGlob: setGlob, matches, quickGlobs };
}
