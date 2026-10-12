import type { SxProps, Theme } from "@mui/material";
import Paper from "@mui/material/Paper";
import { type ReactNode, useRef } from "react";
import { FilterTrigger } from "./FilterTrigger";
import { useDropdownOpen } from "./DropdownWrapper/useDropdownOpen";

export const dropdownStyle: SxProps<Theme> = {
	position: "absolute",
	top: "100%",
	left: 0,
	right: 0,
	mt: 0.25,
	maxHeight: 200,
	overflowY: "auto",
	zIndex: 10,
};

export function DropdownWrapper({
	label,
	children,
	disabled = false,
	onDefaultAction,
	tooltip,
	typeToOpen = false,
}: {
	label: ReactNode;
	children: (close: () => void, initialFilter: string) => ReactNode;
	disabled?: boolean;
	onDefaultAction?: () => void;
	tooltip?: ReactNode;
	typeToOpen?: boolean;
}) {
	const { open, initialFilter, onKeyDown, toggle, close } = useDropdownOpen(
		typeToOpen,
		disabled,
	);
	const wrapperRef = useRef<HTMLFieldSetElement>(null);

	return (
		<Paper
			component="fieldset"
			ref={wrapperRef}
			variant="outlined"
			sx={{ position: "relative", border: "none", m: 0, p: 0 }}
			onBlur={(e: React.FocusEvent) => {
				if (!wrapperRef.current?.contains(e.relatedTarget as Node)) close();
			}}
			onKeyDown={onKeyDown}
		>
			<FilterTrigger
				label={label}
				open={open}
				disabled={disabled}
				onClick={toggle}
				onDefaultAction={onDefaultAction}
				tooltip={tooltip}
			/>
			{open && children(close, initialFilter)}
		</Paper>
	);
}
