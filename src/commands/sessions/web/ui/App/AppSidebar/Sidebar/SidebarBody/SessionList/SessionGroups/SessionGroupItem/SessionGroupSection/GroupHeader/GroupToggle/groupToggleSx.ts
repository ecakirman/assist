const toggle = {
	flex: 1,
	minWidth: 0,
	display: "flex",
	alignItems: "center",
	gap: 1,
	justifyContent: "flex-start",
	textAlign: "left",
	borderRadius: 0.5,
	"&:focus-visible": { outline: 1, outlineColor: "primary.main" },
} as const;

const count = {
	color: "text.disabled",
	fontVariantNumeric: "tabular-nums",
} as const;

const classic = {
	toggle,
	count,
	rule: { flex: 1, minWidth: 8, height: "1px", bgcolor: "divider" },
} as const;

const slate = {
	toggle: { ...toggle, gap: 0.75 },
	count: {
		...count,
		fontFamily: "fontFamilyMono",
		fontSize: 11,
		lineHeight: 1,
	},
	rule: undefined,
} as const;

export const groupToggleSx = (isSlate: boolean) => (isSlate ? slate : classic);
