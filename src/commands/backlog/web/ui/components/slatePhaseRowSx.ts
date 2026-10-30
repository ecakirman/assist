export function slatePhaseRowSx(active: boolean) {
	return {
		justifyContent: "flex-start",
		gap: 1,
		minWidth: 0,
		py: "3px",
		pl: 0.5,
		fontSize: 12,
		textAlign: "left",
		color: active ? "text.primary" : "text.secondary",
		transition: "color .2s ease",
		"&:hover": { color: "text.primary" },
		"& .phase-label": {
			minWidth: 0,
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		},
	} as const;
}
