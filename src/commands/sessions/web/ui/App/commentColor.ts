import { alpha } from "@mui/material/styles";
import { swatches } from "../designSystem/swatches";

type CommentColor = { fill: string; solid: string };

const HUES = swatches.comment;

export function commentColor(index: number): CommentColor {
	const solid = HUES[((index % HUES.length) + HUES.length) % HUES.length];
	return { solid, fill: alpha(solid, 0.35) };
}
