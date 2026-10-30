import type { SvgIconComponent } from "@mui/icons-material";
import ViewColumnOutlined from "@mui/icons-material/ViewColumnOutlined";
import ViewStreamOutlined from "@mui/icons-material/ViewStreamOutlined";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { ViewType } from "react-diff-view";

const options: { value: ViewType; label: string; Icon: SvgIconComponent }[] = [
	{ value: "unified", label: "Unified view", Icon: ViewStreamOutlined },
	{ value: "split", label: "Split view", Icon: ViewColumnOutlined },
];

export function DiffViewTypeToggle({
	viewType,
	onChange,
}: {
	viewType: ViewType;
	onChange: (viewType: ViewType) => void;
}) {
	return (
		<ToggleButtonGroup
			exclusive
			value={viewType}
			aria-label="Diff layout"
			onChange={(_event, next: ViewType | null) => next && onChange(next)}
			sx={{ flex: "0 0 auto" }}
		>
			{options.map(({ value, label, Icon }) => (
				<ToggleButton
					key={value}
					value={value}
					title={label}
					aria-label={label}
					sx={{ px: 0.75 }}
				>
					<Icon />
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	);
}
