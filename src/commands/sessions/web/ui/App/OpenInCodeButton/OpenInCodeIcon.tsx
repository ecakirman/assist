import { VsCodeIcon } from "./VsCodeIcon";
import { VsCodeOutlineIcon } from "./VsCodeOutlineIcon";

export function OpenInCodeIcon({
	outlined,
	small,
}: {
	outlined: boolean;
	small: boolean;
}) {
	if (outlined) return <VsCodeOutlineIcon />;
	return <VsCodeIcon sx={small ? { fontSize: 14 } : undefined} />;
}
