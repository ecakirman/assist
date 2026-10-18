import { CardDataLine } from "./CardBody/CardDataLine";
import { CardExtraLines } from "./CardBody/CardExtraLines";
import { CardMetaLine } from "./CardBody/CardMetaLine";
import type { SessionInfo } from "../../../types";
import { useTopBarLayoutContext } from "../../useTopBarLayoutContext";

export function CardBody({
	session,
	loading,
	onSetAutoApprove,
	onSetAutoAdvance,
}: {
	session: SessionInfo;
	loading: boolean;
	onSetAutoApprove: (enabled: boolean) => void;
	onSetAutoAdvance: (enabled: boolean) => void;
}) {
	const topBar = useTopBarLayoutContext();

	if (loading) return null;

	return (
		<>
			<CardMetaLine session={session} />
			<CardDataLine session={session} />
			{!topBar && (
				<CardExtraLines
					session={session}
					onSetAutoApprove={onSetAutoApprove}
					onSetAutoAdvance={onSetAutoAdvance}
				/>
			)}
		</>
	);
}
