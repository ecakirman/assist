import type { SvgIconProps } from "@mui/material/SvgIcon";
import { OutlineIcon } from "../../designSystem/OutlineIcon";

export function VsCodeOutlineIcon(props: SvgIconProps) {
	return (
		<OutlineIcon {...props}>
			<path d="M11 2l3 1.5v9L11 14 4 8l7-6zM2 6l2 2-2 2" />
		</OutlineIcon>
	);
}
