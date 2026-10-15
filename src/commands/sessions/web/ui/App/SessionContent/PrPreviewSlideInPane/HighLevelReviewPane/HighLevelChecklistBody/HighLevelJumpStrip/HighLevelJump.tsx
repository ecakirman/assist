import { Box, ButtonBase } from "@mui/material";

function jumpSx(active: boolean) {
	return {
		height: "100%",
		px: 1.5,
		gap: 0.75,
		flexShrink: 0,
		fontSize: 12,
		fontWeight: 500,
		letterSpacing: "0.02857em",
		textTransform: "uppercase",
		whiteSpace: "nowrap",
		color: active ? "primary.main" : "text.secondary",
		borderBottom: 2,
		borderColor: active ? "primary.main" : "transparent",
		"&:hover": { color: active ? "primary.main" : "text.primary" },
	} as const;
}

function dotSx(ticked: boolean) {
	return {
		width: 8,
		height: 8,
		borderRadius: "50%",
		border: 1,
		borderColor: ticked ? "success.main" : "text.disabled",
		bgcolor: ticked ? "success.main" : "transparent",
	} as const;
}

export function HighLevelJump({
	label,
	ticked,
	active,
	onJump,
}: {
	label: string;
	ticked: boolean;
	active: boolean;
	onJump: () => void;
}) {
	return (
		<ButtonBase
			onClick={onJump}
			aria-label={`${label}, ${ticked ? "ticked" : "not ticked"}`}
			aria-current={active ? "true" : undefined}
			sx={jumpSx(active)}
		>
			<Box component="span" sx={dotSx(ticked)} />
			{label}
		</ButtonBase>
	);
}
