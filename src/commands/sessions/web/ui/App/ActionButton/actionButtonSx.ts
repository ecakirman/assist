export type ActionButtonTone =
	| "muted"
	| "start"
	| "stop"
	| "starred"
	| "inherit"
	| "secondary";

const tones: Record<
	ActionButtonTone,
	{ color: string; labelled?: string; hover?: string }
> = {
	muted: {
		color: "text.disabled",
		labelled: "text.secondary",
		hover: "text.primary",
	},
	start: {
		color: "text.disabled",
		labelled: "text.secondary",
		hover: "success.main",
	},
	stop: { color: "success.main", hover: "error.main" },
	starred: { color: "warning.main", hover: "warning.main" },
	inherit: { color: "inherit" },
	secondary: { color: "text.secondary", hover: "text.primary" },
};

type ToneSx = { color: string; "&:hover"?: { color: string } };

export function actionButtonSx(
	tone: ActionButtonTone,
	labelled: boolean,
): ToneSx {
	const { color, labelled: labelledColor, hover } = tones[tone];
	const resolved = labelled && labelledColor ? labelledColor : color;
	return hover
		? { color: resolved, "&:hover": { color: hover } }
		: { color: resolved };
}
