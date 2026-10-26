import { type MouseEvent, useRef, useState } from "react";
import {
	CloseItemDialog,
	type CloseItemTarget,
	type ClosingStatus,
} from "./CloseItemDialog";
import { CloseItemMenu } from "./CloseItemMenu";
import { CompactPlayButtonGroup } from "./CompactPlayButtonGroup";
import { useRefineLaunch } from "./useRefineLaunch";

export function CompactPlaySplitButton({
	itemId,
	tooltip,
	disabled,
	onBuild,
	closeTarget,
}: {
	itemId: number;
	tooltip: string;
	disabled: boolean;
	onBuild: () => void;
	closeTarget: CloseItemTarget;
}) {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const [open, setOpen] = useState(false);
	const [closing, setClosing] = useState<ClosingStatus | null>(null);
	const refine = useRefineLaunch(itemId);
	const stop = (event: MouseEvent) => event.stopPropagation();
	return (
		<>
			<CompactPlayButtonGroup
				anchorRef={anchorRef}
				tooltip={tooltip}
				disabled={disabled}
				onBuild={(event) => {
					stop(event);
					onBuild();
				}}
				onMore={(event) => {
					stop(event);
					setOpen(true);
				}}
			/>
			<CloseItemMenu
				anchorEl={anchorRef.current}
				open={open}
				onClose={() => setOpen(false)}
				onRefine={() => {
					setOpen(false);
					refine.launch([]);
				}}
				onSelect={(status) => {
					setOpen(false);
					setClosing(status);
				}}
				stop={stop}
			/>
			{closing && (
				<CloseItemDialog
					itemId={itemId}
					status={closing}
					target={closeTarget}
					onClose={() => setClosing(null)}
				/>
			)}
		</>
	);
}
