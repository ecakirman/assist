import { CardDataLine } from "./CardBody/CardDataLine";
import { CardMetaLine } from "./CardBody/CardMetaLine";
import type { SessionInfo } from "../../../types";

export function CardBody({
	session,
	loading,
}: {
	session: SessionInfo;
	loading: boolean;
}) {
	if (loading) return null;

	return (
		<>
			<CardMetaLine session={session} />
			<CardDataLine session={session} />
		</>
	);
}
