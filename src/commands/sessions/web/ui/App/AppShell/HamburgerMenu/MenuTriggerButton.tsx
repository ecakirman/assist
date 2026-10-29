import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { ConfigButton } from "./MenuTriggerButton/ConfigButton";
import { MenuButton } from "./MenuTriggerButton/MenuButton";
import { VersionBadge } from "./MenuTriggerButton/VersionBadge";

export function MenuTriggerButton({
	open,
	onOpen,
}: {
	open: boolean;
	onOpen: (anchor: HTMLElement) => void;
}) {
	const { design } = useTheme();
	return (
		<Box
			sx={{
				position: "fixed",
				top: 8,
				right: 16,
				zIndex: (t) => t.zIndex.drawer + 2,
				display: "flex",
				alignItems: "center",
				gap: 0.5,
				color: "inherit",
			}}
		>
			{design !== "slate" && <VersionBadge />}
			<ConfigButton />
			<MenuButton open={open} onOpen={onOpen} />
		</Box>
	);
}
