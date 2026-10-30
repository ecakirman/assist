import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router";
import type { NextResponse } from "../../../../../../next/types";
import { NextScopeNote } from "./NextScopeNote";

type NextHeaderProps = {
	loading: boolean;
	data: NextResponse | null;
	onRefresh: () => void;
};

const slateHeadingSx = {
	flex: 1,
	m: 0,
	mb: 0.5,
	fontSize: 22,
	fontWeight: 600,
	lineHeight: 1.3,
	letterSpacing: "-0.01em",
} as const;

export function SlateNextHeader({ loading, data, onRefresh }: NextHeaderProps) {
	return (
		<Stack
			direction="row"
			useFlexGap
			sx={{ mb: "22px", gap: "8px 16px", alignItems: "flex-start" }}
		>
			<Stack sx={{ flex: 1, minWidth: 0 }}>
				<Typography component="h2" sx={slateHeadingSx}>
					Next
				</Typography>
				{data && <NextScopeNote scope={data.scope} boards={data.boards} />}
			</Stack>
			<Stack direction="row" spacing={1}>
				<Button component={RouterLink} to="/config?search=next">
					Next settings
				</Button>
				<Button variant="tonal" onClick={onRefresh} disabled={loading}>
					Refresh
				</Button>
			</Stack>
		</Stack>
	);
}
