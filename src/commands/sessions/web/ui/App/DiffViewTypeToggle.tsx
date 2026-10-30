import type { SvgIconComponent } from "@mui/icons-material";
import ViewColumnOutlined from "@mui/icons-material/ViewColumnOutlined";
import ViewStreamOutlined from "@mui/icons-material/ViewStreamOutlined";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { ViewType } from "react-diff-view";

const options: { value: ViewType; label: string; Icon: SvgIconComponent }[] = [
	{ value: "unified", label: "Unified view", Icon: ViewStreamOutlined },
	{ value: "split", label: "Split view", Icon: ViewColumnOutlined },
];

type Props = {
	viewType: ViewType;
	onChange: (viewType: ViewType) => void;
};

function SegmentedViewTypeToggle({ viewType, onChange }: Props) {
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

export function DiffViewTypeToggle({ viewType, onChange }: Props) {
	const { design } = useTheme();
	if (design === "slate")
		return <SegmentedViewTypeToggle viewType={viewType} onChange={onChange} />;
	return (
		<Box sx={{ display: "flex", flex: "0 0 auto" }}>
			{options.map(({ value, label, Icon }) => {
				const active = viewType === value;
				return (
					<IconButton
						key={value}
						size="small"
						title={label}
						aria-label={label}
						aria-pressed={active}
						onClick={() => onChange(value)}
						sx={{
							color: active ? "text.primary" : "text.disabled",
							bgcolor: active ? "action.selected" : undefined,
							"&:hover": { color: "text.primary" },
						}}
					>
						<Icon sx={{ fontSize: 16 }} />
					</IconButton>
				);
			})}
		</Box>
	);
}
