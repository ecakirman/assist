import { Button } from "@mui/material";
import { usePreviewPrimaryAction } from "../../../../../usePreviewPrimaryAction";

export function PrPreviewApproveButtons({
	canStart,
	onApprove,
	onApproveAndStart,
}: {
	canStart: boolean;
	onApprove: () => void;
	onApproveAndStart: () => void;
}) {
	const primary = usePreviewPrimaryAction();
	return (
		<>
			<Button
				color="primary"
				variant={canStart ? "tonal" : "contained"}
				onClick={onApprove}
				{...(canStart ? {} : primary)}
			>
				Approve
			</Button>
			{canStart && (
				<Button
					color="primary"
					variant="contained"
					onClick={onApproveAndStart}
					{...primary}
				>
					Approve & start
				</Button>
			)}
		</>
	);
}
