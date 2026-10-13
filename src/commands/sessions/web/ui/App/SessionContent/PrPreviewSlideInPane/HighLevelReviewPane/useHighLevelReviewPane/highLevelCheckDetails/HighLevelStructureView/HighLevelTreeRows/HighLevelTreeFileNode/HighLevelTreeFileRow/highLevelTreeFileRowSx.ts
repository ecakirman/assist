import {
	highLevelButtonResetSx,
	highLevelMatchedRowSx,
	highLevelTintedRowSx,
	highLevelTreeRowButtonSx,
	highLevelTreeRowSx,
} from "../../../../highLevelTreeRowSx";

export function highLevelTreeFileRowSx(open: boolean, matched: boolean) {
	return [
		{ ...highLevelTreeRowSx, gap: 0, cursor: "pointer" },
		open && highLevelTintedRowSx,
		matched && highLevelMatchedRowSx,
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
