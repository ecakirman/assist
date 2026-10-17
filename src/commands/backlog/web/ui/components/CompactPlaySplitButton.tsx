import { ButtonGroup } from "@mui/material";
import { type MouseEvent, useRef, useState } from "react";
import { BuildSegment } from "./BuildSegment";
import { MarkDoneDialog, type MarkDoneTarget } from "./MarkDoneDialog";
import { MarkDoneMenu } from "./MarkDoneMenu";
import { MoreActionsSegment } from "./MoreActionsSegment";

export function CompactPlaySplitButton({
	itemId,
	tooltip,
	disabled,
	onBuild,
	markDone,
}: {
	itemId: number;
	tooltip: string;
	disabled: boolean;
	onBuild: () => void;
	markDone: MarkDoneTarget;
}) {
	const anchorRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const stop = (event: MouseEvent) => event.stopPropagation();
	return (
		<>
			<ButtonGroup
				ref={anchorRef}
				variant="contained"
				color="success"
				size="small"
			>
				<BuildSegment
					compact
					tooltip={tooltip}
					disabled={disabled}
					onClick={(event) => {
						stop(event);
						onBuild();
					}}
				/>
				<MoreActionsSegment
					onClick={(event) => {
						stop(event);
						setOpen(true);
					}}
				/>
			</ButtonGroup>
			<MarkDoneMenu
				anchorEl={anchorRef.current}
				open={open}
				onClose={() => setOpen(false)}
				onMarkDone={() => {
					setOpen(false);
					setConfirming(true);
				}}
				stop={stop}
			/>
			{confirming && (
				<MarkDoneDialog
					itemId={itemId}
					target={markDone}
					onClose={() => setConfirming(false)}
				/>
			)}
		</>
	);
}
