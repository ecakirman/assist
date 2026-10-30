import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import { tokenBadgeSx } from "../../../../../../../designSystem/tokenBadgeSx";
import { isServing } from "../../../../../findServingSessions";
import { PortLink } from "../../../../../PortLink";
import type { SessionInfo } from "../../../../../../../types";

const chipSx = { height: 18, fontSize: "0.65rem" };

const slateSx = tokenBadgeSx("success");

export function ServingChip({ session }: { session: SessionInfo }) {
	const slate = useTheme().design === "slate";
	if (!isServing(session)) return null;
	if (slate)
		return (
			<Box component="span" sx={slateSx}>
				{session.port ? <PortLink port={session.port} /> : "serving"}
			</Box>
		);
	const label = session.port ? (
		<>
			serving <PortLink port={session.port} />
		</>
	) : (
		"serving"
	);
	return <Chip label={label} color="success" size="small" sx={chipSx} />;
}
