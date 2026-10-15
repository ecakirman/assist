export const highLevelStructureToolbarSx = {
	position: "sticky",
	top: -16,
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
