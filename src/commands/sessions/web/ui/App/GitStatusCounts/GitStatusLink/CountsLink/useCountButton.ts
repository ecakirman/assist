import { useTheme } from "@mui/material/styles";
import { countButtonSx } from "../../../../designSystem/countButtonSx";
import { useDiffPanels } from "../../../useDiffPanels";

export function useCountButton(
	panelSessionId: string,
	scope: string,
	countButton: boolean,
) {
	const slate = useTheme().design === "slate";
	const open = useDiffPanels().panelFor(panelSessionId);
	if (!countButton || !slate) return undefined;
	const pressed =
		open !== undefined &&
		(scope === "uncommitted"
			? open.scope === scope
			: open.scope !== "uncommitted");
	return { pressed, sx: countButtonSx(pressed) };
}
