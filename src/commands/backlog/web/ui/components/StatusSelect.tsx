import { MenuItem, Select } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type StatusSelectProps<T extends string> = {
	value: T;
	options: readonly T[];
	onChange: (value: T) => void;
	label: (value: T) => string;
	sx: SxProps<Theme>;
};

export const StatusSelect = <T extends string>(props: StatusSelectProps<T>) => {
	const { value, options, onChange, label, sx } = props;
	return (
		<Select
			value={value}
			onChange={(e) => onChange(e.target.value as T)}
			size="small"
			renderValue={label}
			sx={sx}
		>
			{options.map((s) => (
				<MenuItem key={s} value={s}>
					{label(s)}
				</MenuItem>
			))}
		</Select>
	);
};
