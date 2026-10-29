import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
	const slate = useTheme().design === "slate";
	const color = slate ? "primary" : "success";
	const secondaryVariant = slate ? "tonal" : "outlined";
	return (
		<>
			<Button
				color={color}
				variant={canStart ? secondaryVariant : "contained"}
				onClick={onApprove}
				{...(canStart ? {} : primary)}
			>
				Approve
			</Button>
			{canStart && (
				<Button
					color={color}
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
