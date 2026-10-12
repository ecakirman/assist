import DifferenceOutlinedIcon from "@mui/icons-material/DifferenceOutlined";
import IconButton from "@mui/material/IconButton";
import type { MouseEvent } from "react";
import { releaseQueuedDiffSx } from "./releaseQueuedDiffSx";

export function ReleaseQueuedDiffButton({
	environment,
	open,
	title,
	onClick,
}: {
	environment: string | null;
	open: boolean;
	title: string;
	onClick: (event: MouseEvent<HTMLElement>) => void;
}) {
	return (
		<IconButton
			sx={releaseQueuedDiffSx.button}
			aria-label={`Show changes queued for ${environment}`}
			aria-expanded={open}
			aria-haspopup="dialog"
			title={title}
			onClick={onClick}
		>
			<DifferenceOutlinedIcon sx={releaseQueuedDiffSx.icon} />
		</IconButton>
	);
}
