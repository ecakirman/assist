import { MenuItem, Select } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type StatusSelectProps<T extends string> = {
	value: T;
	options: readonly T[];
	colors: Record<T, { bg: string; text: string }>;
	onChange: (value: T) => void;
	label?: (value: T) => string;
	sx?: SxProps<Theme>;
};

function classicSx(colors: { bg: string; text: string }) {
	return {
		fontSize: "0.75rem",
		fontWeight: 500,
		borderRadius: 4,
		bgcolor: colors.bg,
		color: colors.text,
		"& .MuiSelect-select": {
			py: 0.5,
			px: 1.5,
		},
		"& .MuiSelect-icon": {
			color: "inherit",
		},
	};
}

export const StatusSelect = <T extends string>(props: StatusSelectProps<T>) => {
	const { value, options, colors, onChange, label = (s: T) => s, sx } = props;
	return (
		<Select
			value={value}
			onChange={(e) => onChange(e.target.value as T)}
			size="small"
			renderValue={label}
			sx={sx ?? classicSx(colors[value])}
		>
			{options.map((s) => (
				<MenuItem key={s} value={s}>
					{label(s)}
				</MenuItem>
			))}
		</Select>
	);
};
