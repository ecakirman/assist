import type { NextBoard, NextScope } from "../../../../../../../next/types";
import { NextProjectLinks } from "./NextProjectLinks";

function pickupFilterText(scope: NextScope) {
	const excluded = [
		scope.excludeLabels.length > 0 &&
			`labels ${scope.excludeLabels.join(", ")}`,
		scope.excludeTypes.length > 0 && `types ${scope.excludeTypes.join(", ")}`,
	].filter(Boolean);
	const excluding =
		excluded.length > 0 ? `, excluding ${excluded.join("; ")}` : "";
	return `, picking up ${scope.pickStatuses.join(", ")}${excluding}`;
}

export function projectsValue(scope: NextScope, boards: NextBoard[]) {
	if (scope.projects.length === 0) return null;
	return (
		<>
			<NextProjectLinks projects={scope.projects} boards={boards} />
			{pickupFilterText(scope)}
		</>
	);
}
