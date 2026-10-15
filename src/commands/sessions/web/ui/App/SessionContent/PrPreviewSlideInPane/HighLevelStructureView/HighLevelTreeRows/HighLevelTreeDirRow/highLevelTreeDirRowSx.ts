import {
	highLevelButtonResetSx,
	highLevelMatchedRowSx,
	highLevelTreeNameSx,
	highLevelTreeRowButtonSx,
	highLevelTreeRowSx,
} from "../../../highLevelTreeRowSx";

export function highLevelTreeDirRowSx(indent: string, matched: boolean) {
	return [
		{
			...highLevelTreeRowSx,
			...highLevelTreeRowButtonSx,
			pl: indent,
			...highLevelButtonResetSx,
		},
		matched && highLevelMatchedRowSx,
	];
}

export function highLevelTreeDirNameSx(collapsed: boolean, ignored: boolean) {
	return {
		...highLevelTreeNameSx,
		fontWeight: 600,
		color: ignored ? "text.secondary" : collapsed ? "primary.main" : undefined,
	};
}
