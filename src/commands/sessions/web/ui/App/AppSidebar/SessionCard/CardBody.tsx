import { CardDataLine } from "./CardBody/CardDataLine";
import { CardExtraLines } from "./CardBody/CardExtraLines";
import { CardMetaLine } from "./CardBody/CardMetaLine";
import type { SessionInfo } from "../../../types";
import { useTopBarLayoutContext } from "../../useTopBarLayoutContext";

export function CardBody({
	session,
	loading,
	onSetAutoAdvance,
}: {
	session: SessionInfo;
	loading: boolean;
	onSetAutoAdvance: (enabled: boolean) => void;
}) {
	const topBar = useTopBarLayoutContext();

	if (loading) return null;

	return (
		<>
			<CardMetaLine session={session} />
			<CardDataLine session={session} />
			{!topBar && (
				<CardExtraLines session={session} onSetAutoAdvance={onSetAutoAdvance} />
			)}
		</>
	);
}
