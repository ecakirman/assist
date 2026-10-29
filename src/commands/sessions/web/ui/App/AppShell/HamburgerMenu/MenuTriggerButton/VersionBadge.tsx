import ButtonBase from "@mui/material/ButtonBase";
import Tooltip from "@mui/material/Tooltip";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { ChordTooltipTitle } from "../../../ChordTooltipTitle";
import { useCaptureHotkey } from "../../../useCaptureHotkey";
import { useShortcut } from "../../../useShortcut";
import { isUpdateReady } from "../../isUpdateReady";
import { useNodeUpdatesContext } from "../../useNodeUpdatesContext";
import { assistVersion } from "../../assistVersion";
import { DaemonMismatchWarning } from "./VersionBadge/DaemonMismatchWarning";
import { versionBadgeSx } from "./VersionBadge/versionBadgeSx";

export function VersionBadge({
	onStatusBar = false,
}: {
	onStatusBar?: boolean;
}) {
	const { entries } = useNodeUpdatesContext();
	const navigate = useNavigate();
	const openUpdates = useCallback(() => navigate("/updates"), [navigate]);
	const { matches, chords } = useShortcut("openUpdates");
	useCaptureHotkey(matches, openUpdates);
	if (!assistVersion) return null;
	const ready = entries.filter(isUpdateReady).length;
	return (
		<>
			<Tooltip
				describeChild
				placement={onStatusBar ? "top-start" : "bottom"}
				title={<ChordTooltipTitle label="Updates" chords={chords} />}
			>
				<ButtonBase
					component={Link}
					to="/updates"
					aria-label={
						ready
							? `Updates: ${ready} node${ready > 1 ? "s have" : " has"} an update ready`
							: "Updates"
					}
					sx={versionBadgeSx(ready > 0, onStatusBar)}
				>
					{ready > 0 && <span className="ready-dot" aria-hidden />}
					<span>v{assistVersion}</span>
					{ready > 0 && <span className="ready-count">{ready} ready</span>}
				</ButtonBase>
			</Tooltip>
			<DaemonMismatchWarning />
		</>
	);
}
