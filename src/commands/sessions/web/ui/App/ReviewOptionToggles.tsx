import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import {
	type ReviewOptions,
	reviewOptionFlags,
} from "../../../../../shared/reviewOptionFlags";

const labelSx = { "& .MuiFormControlLabel-label": { fontSize: 12 } } as const;

export function ReviewOptionToggles({
	value,
	onChange,
}: {
	value: ReviewOptions;
	onChange: (options: ReviewOptions) => void;
}) {
	return (
		<FormGroup sx={{ px: 2, py: 0.5 }}>
			{reviewOptionFlags.map(({ key, label }) => (
				<FormControlLabel
					key={key}
					control={
						<Checkbox
							size="small"
							checked={value[key]}
							onChange={(e) => onChange({ ...value, [key]: e.target.checked })}
						/>
					}
					label={label}
					sx={labelSx}
				/>
			))}
		</FormGroup>
	);
}
