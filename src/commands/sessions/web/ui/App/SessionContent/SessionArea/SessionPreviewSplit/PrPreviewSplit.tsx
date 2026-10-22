import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import type { PrPreview } from "../../../../../../shared/SessionInfoBase";
import type { PrDecisionDetails } from "../../../../PrDecisionDetails";
import { PreviewWidthContext } from "../../usePreviewWidthContext";
import { PrPreviewSlideIn } from "./PrPreviewSplit/PrPreviewSlideIn";
import { PrPreviewTerminalColumn } from "./PrPreviewSplit/PrPreviewTerminalColumn";
import type { SessionInfo } from "../../../../types";
import { usePreviewWidth } from "./PrPreviewSplit/usePreviewWidth";
import { useRetainedPreview } from "./PrPreviewSplit/useRetainedPreview";

type OnDecision = (
	requestId: string,
	decision: "approve" | "reject",
	details: PrDecisionDetails,
) => void;

export function PrPreviewSplit({
	preview,
	stackedShow,
	session,
	sessionId,
	cwd,
	sendInput,
	onDecision,
	children,
}: {
	preview: PrPreview | null;
	stackedShow?: PrPreview | undefined;
	session?: SessionInfo | undefined;
	sessionId?: string;
	cwd?: string;
	sendInput?: ((sessionId: string, data: string) => void) | undefined;
	onDecision: OnDecision;
	children: ReactNode;
}) {
	const { rendered, onExited } = useRetainedPreview(preview);
	const width = usePreviewWidth(rendered);
	const open = preview !== null;

	return (
		<Box
			sx={{
				display: "flex",
				flex: 1,
				minHeight: 0,
				position: "relative",
				overflow: "hidden",
			}}
		>
			<PrPreviewTerminalColumn open={open} full={width.full}>
				{children}
			</PrPreviewTerminalColumn>
			<PreviewWidthContext.Provider value={width}>
				<PrPreviewSlideIn
					rendered={rendered}
					stackedShow={open ? stackedShow : undefined}
					session={session}
					sessionId={sessionId}
					cwd={cwd}
					sendInput={sendInput}
					open={open}
					onExited={onExited}
					onDecision={onDecision}
				/>
			</PreviewWidthContext.Provider>
		</Box>
	);
}
