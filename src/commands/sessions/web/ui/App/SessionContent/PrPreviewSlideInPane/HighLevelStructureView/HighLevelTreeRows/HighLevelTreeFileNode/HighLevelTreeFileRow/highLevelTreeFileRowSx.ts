import type { Theme } from "@mui/material";
import { highLevelStructureStickyTop } from "../../../../highLevelStructureToolbarSx";
import {
	highLevelButtonResetSx,
	highLevelMatchedRowSx,
	highLevelTintedRowSx,
	highLevelTreeRowButtonSx,
	highLevelTreeRowSx,
} from "../../../../highLevelTreeRowSx";

const overlay = (colour: string) => `linear-gradient(${colour}, ${colour})`;

function opaqueStickyRowSx(open: boolean) {
	return (theme: Theme) => {
		const tint = highLevelTintedRowSx(theme);
		const rest = open ? tint.bgcolor : "transparent";
		const hover = open ? tint["&:hover"].bgcolor : theme.palette.action.hover;
		return {
			position: "sticky",
			top: highLevelStructureStickyTop,
			zIndex: 2,
			bgcolor: "background.paper",
			backgroundImage: overlay(rest),
			"&:hover": {
				bgcolor: "background.paper",
				backgroundImage: overlay(hover),
			},
		} as const;
	};
}

export function highLevelTreeFileRowSx(open: boolean, matched: boolean) {
	return [
		{ ...highLevelTreeRowSx, gap: 0, cursor: "pointer" },
		matched && highLevelMatchedRowSx,
		opaqueStickyRowSx(open),
	];
}

export function highLevelTreeFileButtonSx(indent: string) {
	return {
		...highLevelTreeRowSx,
		minHeight: highLevelTreeRowButtonSx.minHeight,
		"&:hover": undefined,
		minWidth: 0,
		pl: indent,
		...highLevelButtonResetSx,
	};
}
