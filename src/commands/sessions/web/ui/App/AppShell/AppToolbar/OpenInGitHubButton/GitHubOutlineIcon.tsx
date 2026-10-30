import type { SvgIconProps } from "@mui/material/SvgIcon";
import { OutlineIcon } from "../../../../designSystem/OutlineIcon";

export function GitHubOutlineIcon(props: SvgIconProps) {
	return (
		<OutlineIcon {...props}>
			<circle cx="8" cy="8" r="6" />
			<path d="M6 13.5v-2c0-.8.3-1.3.7-1.5-2-.2-3.2-1-3.2-3 0-.6.2-1.1.6-1.5-.1-.4-.1-1 .1-1.5 0 0 .6-.2 1.8.6a6 6 0 0 1 3.2 0c1.2-.8 1.8-.6 1.8-.6.2.5.2 1.1.1 1.5.4.4.6.9.6 1.5 0 2-1.2 2.8-3.2 3 .4.3.7.8.7 1.5v2" />
		</OutlineIcon>
	);
}
