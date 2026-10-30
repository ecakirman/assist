import type { ChipProps } from "@mui/material";
import { Chip, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { PhaseStatus } from "../types";
import { type PhaseHeaderProps, PhaseRewind } from "./PhaseRewind";
import { SlatePhaseHeader } from "./SlatePhaseHeader";

const statusBadge: Record<
	PhaseStatus,
	{ label: string; color: ChipProps["color"] }
> = {
	done: { label: "Done", color: "success" },
	current: { label: "In Progress", color: "info" },
	upcoming: { label: "Upcoming", color: "default" },
};

const headerSx = { alignItems: "center", mb: 1 } as const;

const nameSx = { fontWeight: 500 } as const;

const chipSx = {
	fontWeight: 500,
	fontSize: "0.75rem",
} as const;

export function PhaseHeader(props: PhaseHeaderProps) {
	const slate = useTheme().design === "slate";
	if (slate) return <SlatePhaseHeader {...props} />;
	const badge = statusBadge[props.status];
	return (
		<Stack direction="row" spacing={1} sx={headerSx}>
			<Typography sx={nameSx}>
				Phase {props.index + 1}: {props.phase.name}
			</Typography>
			<Chip label={badge.label} size="small" color={badge.color} sx={chipSx} />
			<PhaseRewind {...props} />
		</Stack>
	);
}
