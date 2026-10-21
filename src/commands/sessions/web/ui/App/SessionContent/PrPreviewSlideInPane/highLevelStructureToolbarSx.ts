import { JUMP_STRIP_HEIGHT } from "./highLevelCheckDomId";

export const HIGH_LEVEL_STRUCTURE_TOOLBAR_HEIGHT_VAR =
	"--high-level-structure-toolbar-height";

export const highLevelStructureStickyTop = `calc(${JUMP_STRIP_HEIGHT}px + var(${HIGH_LEVEL_STRUCTURE_TOOLBAR_HEIGHT_VAR}, 0px))`;

export const highLevelStructureToolbarSx = {
	position: "sticky",
	top: JUMP_STRIP_HEIGHT,
	zIndex: 3,
	bgcolor: "background.paper",
	py: 1,
	mt: 0.5,
	display: "flex",
	flexDirection: "column",
	gap: 0.75,
	borderBottom: 1,
	borderColor: "divider",
} as const;

export const highLevelStructureToolbarRowSx = {
	display: "flex",
	alignItems: "center",
	flexWrap: "wrap",
	gap: 0.75,
} as const;
