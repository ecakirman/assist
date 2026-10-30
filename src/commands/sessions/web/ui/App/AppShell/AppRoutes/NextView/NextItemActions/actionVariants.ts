import type { ButtonProps } from "@mui/material/Button";

type Variant = ButtonProps["variant"];

export function actionVariants(size: "small" | "medium"): {
	start: Variant;
	link: Variant;
} {
	return size === "medium"
		? { start: "contained", link: "tonal" }
		: { start: "tonal", link: "text" };
}
