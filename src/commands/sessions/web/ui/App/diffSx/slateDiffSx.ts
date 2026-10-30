import { alpha, type Theme } from "@mui/material/styles";

const sign = (content: string, color: string) => ({
	"&::before": {
		content: `"${content}"`,
		display: "inline-block",
		width: 14,
		color,
	},
});

export function slateDiffSx(t: Theme) {
	const { success, error, info, primary, text } = t.palette;
	const added = alpha(success.main, 0.11);
	const removed = alpha(error.main, 0.12);
	return {
		"--diff-selection-background-color": alpha(primary.main, 0.3),
		"--diff-gutter-insert-background-color": added,
		"--diff-gutter-delete-background-color": removed,
		"--diff-code-insert-background-color": added,
		"--diff-code-delete-background-color": removed,
		"--diff-code-insert-edit-background-color": alpha(success.main, 0.2),
		"--diff-code-delete-edit-background-color": alpha(error.main, 0.2),
		"--diff-font-family": t.typography.fontFamilyMono,
		"& .diff": { fontSize: 12, lineHeight: "20px", tabSize: 4 },
		"& .diff-gutter": {
			color: text.disabled,
			minWidth: 36,
			px: 0,
			pr: 1,
			textAlign: "right",
		},
		"& .diff-gutter-insert": { color: alpha(success.main, 0.6) },
		"& .diff-code": { pl: 0, py: 0, lineHeight: "20px" },
		"& .diff-code-normal": sign(" ", text.disabled),
		"& .diff-code-insert": sign("+", success.main),
		"& .diff-code-delete": sign("−", error.main),
		"& .diff-decoration-content": {
			px: 1.5,
			py: "2px",
			color: info.main,
			bgcolor: alpha(info.main, 0.07),
			fontFamily: t.typography.fontFamilyMono,
			fontSize: 11.5,
		},
	};
}
