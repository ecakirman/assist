import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

const outlineSx = {
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.6,
	strokeLinecap: "round",
	strokeLinejoin: "round",
} as const;

export function OutlineIcon({ children, sx, ...props }: SvgIconProps) {
	return (
		<SvgIcon viewBox="0 0 16 16" sx={[outlineSx, sx ?? {}].flat()} {...props}>
			{children}
		</SvgIcon>
	);
}
