import { countButtonSx } from "../../../../designSystem/countButtonSx";
import { useDiffPanels } from "../../../useDiffPanels";

export function useCountButton(
	panelSessionId: string,
	scope: string,
	countButton: boolean,
) {
	const open = useDiffPanels().panelFor(panelSessionId);
	if (!countButton) return undefined;
	const pressed =
		open !== undefined &&
		(scope === "uncommitted"
			? open.scope === scope
			: open.scope !== "uncommitted");
	return { pressed, sx: countButtonSx(pressed) };
}
