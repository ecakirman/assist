import type { ButtonProps } from "@mui/material/Button";

const bordered = ({ variant }: ButtonProps) =>
	variant === "outlined" || variant === "tonal";

export const buttonSizeVariants = [
	{
		props: { size: "small" as const },
		style: { minHeight: 26, padding: "4px 9px", fontSize: 12 },
	},
	{ props: bordered, style: { padding: "5px 11px" } },
	{
		props: (props: ButtonProps) => bordered(props) && props.size === "small",
		style: { padding: "3px 8px" },
	},
];
