const CONTAINER_NAME = "item-detail";
const MIN_WIDTH_WITH_NAVIGATOR = 760;

export const itemDetailLayout = {
	wideQuery: `@container ${CONTAINER_NAME} (min-width: ${MIN_WIDTH_WITH_NAVIGATOR}px)`,
	containerSx: {
		containerType: "inline-size",
		containerName: CONTAINER_NAME,
	},
	columnsSx: {
		display: "flex",
		columnGap: 3,
	},
	slateColumnsSx: {
		display: "flex",
		alignItems: "flex-start",
		columnGap: 4,
	},
	mainColumnSx: { flex: 1, minWidth: 0 },
} as const;
