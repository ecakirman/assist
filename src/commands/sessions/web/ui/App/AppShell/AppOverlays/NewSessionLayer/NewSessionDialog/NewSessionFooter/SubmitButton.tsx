import Button from "@mui/material/Button";

export type FooterProps = {
	submitLabel: string;
	disabled?: boolean;
	loading?: boolean;
};

export const FOOTER_HINTS = [
	["Enter", "start"],
	["Shift+Enter", "newline"],
	["Esc", "close"],
] as const;

export function SubmitButton({
	submitLabel,
	disabled = false,
	loading = false,
	size,
}: FooterProps & { size: "small" | "medium" }) {
	return (
		<Button
			type="submit"
			variant="contained"
			size={size}
			disabled={disabled}
			loading={loading}
		>
			{submitLabel}
		</Button>
	);
}
