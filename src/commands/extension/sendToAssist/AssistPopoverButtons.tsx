import { Button, Stack } from "@mui/material";

export function AssistPopoverButtons({
	labels,
	disabled,
	onClick,
}: {
	labels: string[];
	disabled: boolean;
	onClick: (index: number) => void;
}) {
	return (
		<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
			{labels.map((label, index) => (
				<Button
					key={label}
					size="small"
					variant={index === 0 ? "contained" : "outlined"}
					disabled={disabled}
					onMouseDown={(event) => event.preventDefault()}
					onClick={() => onClick(index)}
				>
					{label}
				</Button>
			))}
		</Stack>
	);
}
