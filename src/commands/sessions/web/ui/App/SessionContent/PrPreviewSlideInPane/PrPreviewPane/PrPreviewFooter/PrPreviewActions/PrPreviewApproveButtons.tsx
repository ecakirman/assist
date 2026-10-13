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
				color="success"
				variant={canStart ? "outlined" : "contained"}
				onClick={onApprove}
				{...(canStart ? {} : primary)}
			>
				Approve
			</Button>
			{canStart && (
				<Button
					color="success"
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
