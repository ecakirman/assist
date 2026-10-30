import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InputAdornment from "@mui/material/InputAdornment";

const slateInputSx = {
	fontSize: 13,
	height: 36,
	pr: 1,
	cursor: "pointer",
	"& input": { cursor: "text" },
} as const;

const chevronSx = { fontSize: 16, color: "text.disabled" } as const;

export function repoComboboxSlotProps(open: boolean, slate = false) {
	return {
		htmlInput: {
			role: "combobox",
			"aria-label": "Repo",
			"aria-expanded": open,
		},
		input: slate
			? {
					sx: slateInputSx,
					endAdornment: (
						<InputAdornment position="end">
							<KeyboardArrowDownIcon sx={chevronSx} />
						</InputAdornment>
					),
				}
			: { sx: { fontSize: 13, height: 40 } },
	};
}
