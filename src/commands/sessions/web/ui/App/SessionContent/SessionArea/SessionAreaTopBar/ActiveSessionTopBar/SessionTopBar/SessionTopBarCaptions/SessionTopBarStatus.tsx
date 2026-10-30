import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { statusPillSx } from "../../../../../../../designSystem/statusPillSx";
import { displayStatus } from "../../../../../../../displayStatus";
import { statusGlyph } from "../../../../../../../statusGlyph";
import { isVerifying } from "../../../../../../isVerifying";
import { SessionRunningDot } from "../../../../../../SessionRunningDot";
import { SessionStatusDot } from "./SessionTopBarStatus/SessionStatusDot";
import { statusColors } from "../../../../../../statusColors";
import type { SessionInfo } from "../../../../../../../types";

const asideSx = { flexShrink: 0, whiteSpace: "nowrap" } as const;

const verifyingSx = {
	display: "flex",
	alignItems: "center",
	gap: 0.25,
	flexShrink: 0,
} as const;

function StatusLabel({ session }: { session: SessionInfo }) {
	const slate = useTheme().design === "slate";
	if (!isVerifying(session))
		return <SessionStatusDot status={displayStatus(session)} label />;

	if (slate)
		return (
			<Box component="span" sx={statusPillSx(statusColors.running)}>
				{statusGlyph.running} verifying
			</Box>
		);

	return (
		<Box sx={verifyingSx}>
			<SessionRunningDot ring title="verifying" />
			<Typography variant="caption" sx={{ color: statusColors.running }}>
				running
			</Typography>
		</Box>
	);
}

export function SessionTopBarStatus({ session }: { session: SessionInfo }) {
	const { restored } = session;

	return (
		<>
			<StatusLabel session={session} />
			{restored !== undefined && (
				<Typography
					variant="caption"
					sx={{ ...asideSx, color: restored ? "success.main" : "warning.main" }}
				>
					{restored ? "restored" : "not restored"}
				</Typography>
			)}
		</>
	);
}
