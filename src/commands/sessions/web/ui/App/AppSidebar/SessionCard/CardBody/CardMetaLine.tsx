import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";
import { areChipsLoading } from "../areChipsLoading";
import { CardChips } from "./CardMetaLine/CardChips";
import { CardToggleCaptions } from "./CardMetaLine/CardToggleCaptions";
import { sessionToggles } from "../../../sessionToggles";
import type { SessionInfo } from "../../../../types";

const metaSx = {
	gridColumn: 2,
	gridRow: 2,
	display: "flex",
	alignItems: "center",
	gap: 0.625,
	minWidth: 0,
	overflow: "hidden",
	fontSize: "0.6875rem",
	lineHeight: "16px",
	color: (t: Theme) =>
		t.design === "slate" ? t.palette.text.secondary : t.palette.text.disabled,
} as const;

export function CardMetaLine({ session }: { session: SessionInfo }) {
	if (areChipsLoading(session, false)) return null;

	return (
		<Box sx={metaSx}>
			<CardChips session={session} />
			<CardToggleCaptions toggles={sessionToggles(session)} />
		</Box>
	);
}
