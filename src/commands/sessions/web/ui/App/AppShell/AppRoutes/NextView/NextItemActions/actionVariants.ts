import type { ButtonProps } from "@mui/material/Button";
import type { DesignName } from "../../../../../designSystem/DesignTokens";

type Variant = ButtonProps["variant"];

export function actionVariants(
	design: DesignName,
	size: "small" | "medium",
): { start: Variant; link: Variant } {
	if (design !== "slate") return { start: "outlined", link: "outlined" };
	return size === "medium"
		? { start: "contained", link: "tonal" }
		: { start: "tonal", link: "text" };
}
