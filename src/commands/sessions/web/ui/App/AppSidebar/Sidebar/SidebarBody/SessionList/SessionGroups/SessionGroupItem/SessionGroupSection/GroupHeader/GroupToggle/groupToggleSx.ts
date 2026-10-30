export const groupToggleSx = {
	toggle: {
		flex: 1,
		minWidth: 0,
		display: "flex",
		alignItems: "center",
		gap: 0.75,
		justifyContent: "flex-start",
		textAlign: "left",
		borderRadius: 0.5,
		"&:focus-visible": { outline: 1, outlineColor: "primary.main" },
	},
	count: {
		color: "text.disabled",
		fontVariantNumeric: "tabular-nums",
		fontFamily: "fontFamilyMono",
		fontSize: 11,
		lineHeight: 1,
	},
} as const;
