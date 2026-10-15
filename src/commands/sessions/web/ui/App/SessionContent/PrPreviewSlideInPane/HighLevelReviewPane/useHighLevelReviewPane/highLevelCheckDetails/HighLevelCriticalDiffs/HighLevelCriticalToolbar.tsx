import { Box } from "@mui/material";
import type { ComponentProps } from "react";
import type { ViewType } from "react-diff-view";
import { DiffViewTypeToggle } from "../../../../../../DiffViewTypeToggle";
import { HighLevelBulkButtons } from "../../../../HighLevelBulkButtons";
import { highLevelStructureToolbarRowSx } from "../../../../highLevelStructureToolbarSx";

export function HighLevelCriticalToolbar({
	bulk,
	viewType,
	onChangeViewType,
}: {
	bulk: ComponentProps<typeof HighLevelBulkButtons>["bulk"];
	viewType: ViewType;
	onChangeViewType: (viewType: ViewType) => void;
}) {
	return (
		<Box sx={highLevelStructureToolbarRowSx}>
			<HighLevelBulkButtons bulk={bulk} />
			<Box sx={{ ml: "auto" }}>
				<DiffViewTypeToggle viewType={viewType} onChange={onChangeViewType} />
			</Box>
		</Box>
	);
}
