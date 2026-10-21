import { useRef } from "react";
import { useElementHeight } from "../../../../../../../backlog/web/ui/components/useElementHeight";
import { HIGH_LEVEL_STRUCTURE_TOOLBAR_HEIGHT_VAR } from "../highLevelStructureToolbarSx";

export function useStructureToolbarOffset() {
	const toolbarRef = useRef<HTMLDivElement>(null);
	const height = useElementHeight(toolbarRef, 0);
	return {
		toolbarRef,
		offsetSx: { [HIGH_LEVEL_STRUCTURE_TOOLBAR_HEIGHT_VAR]: `${height}px` },
	};
}
