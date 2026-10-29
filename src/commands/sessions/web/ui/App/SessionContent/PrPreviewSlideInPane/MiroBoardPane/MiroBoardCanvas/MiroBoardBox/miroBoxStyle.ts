import type { MiroItem } from "../../../../../../../../../miro/types";
import { swatches } from "../../../../../../designSystem/swatches";
import type { AnchorRole } from "../../useMiroAnchorSelection";

const roleColour: Record<AnchorRole, string> = {
	"top-left": swatches.miro.topLeft,
	"bottom-right": swatches.miro.bottomRight,
};

type MiroBoxStyle = {
	width: number;
	height: number;
	fontSize: number;
	radius: number;
	colour: string;
	opacity: number;
	strokeWidth: number;
};

export function miroBoxStyle(
	box: MiroItem,
	role: AnchorRole | null,
): MiroBoxStyle {
	const width = box.right - box.left;
	const height = box.bottom - box.top;
	return {
		width,
		height,
		fontSize: Math.max(6, Math.min(height * 0.3, width / 6, 28)),
		radius: Math.min(8, height / 4),
		colour: role ? roleColour[role] : swatches.miro.box,
		opacity: role ? 0.75 : 0.35,
		strokeWidth: Math.max(1, width * 0.004),
	};
}
