import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { rewindPhase } from "../api";
import { useApiNode } from "../../../../sessions/web/ui/useApiNode";
import { useRepoCwd } from "../useRepoCwd";
import { RewindDialog } from "./RewindDialog";

const classicRewindSx = {
	ml: "auto",
	textTransform: "none",
	fontSize: "0.75rem",
} as const;

const slateRewindSx = {
	ml: "auto",
	minHeight: 0,
	px: "6px",
	py: "2px",
	fontSize: 12,
	fontWeight: 500,
	borderRadius: "4px",
} as const;

type RewindActionProps = {
	itemId: number;
	phaseNumber: number;
	phaseName: string;
	onRewound: () => Promise<void>;
};

export function RewindAction({
	itemId,
	phaseNumber,
	phaseName,
	onRewound,
}: RewindActionProps) {
	const cwd = useRepoCwd();
	const node = useApiNode();
	const [showDialog, setShowDialog] = useState(false);
	const slate = useTheme().design === "slate";
	return (
		<>
			<Button
				size="small"
				color={slate ? "primary" : "warning"}
				variant={slate ? "text" : "outlined"}
				onClick={() => setShowDialog(true)}
				sx={slate ? slateRewindSx : classicRewindSx}
			>
				Rewind
			</Button>
			{showDialog && (
				<RewindDialog
					phaseName={phaseName}
					onConfirm={async (reason) => {
						await rewindPhase(itemId, phaseNumber, reason, cwd, node);
						await onRewound();
					}}
					onCancel={() => setShowDialog(false)}
				/>
			)}
		</>
	);
}
