import { Button } from "@mui/material";

export function PrPreviewApproveButtons({
	canStart,
	onApprove,
	onApproveAndStart,
}: {
	canStart: boolean;
	onApprove: () => void;
	onApproveAndStart: () => void;
}) {
	return (
		<>
			<Button
				color="success"
				variant={canStart ? "outlined" : "contained"}
				onClick={onApprove}
				data-preview-primary-action={canStart ? undefined : ""}
			>
				Approve
			</Button>
			{canStart && (
				<Button
					color="success"
					variant="contained"
					onClick={onApproveAndStart}
					data-preview-primary-action=""
				>
					Approve & start
				</Button>
			)}
		</>
	);
}
