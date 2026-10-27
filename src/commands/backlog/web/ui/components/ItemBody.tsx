import { Box } from "@mui/material";
import { AcceptanceCriteriaList } from "./AcceptanceCriteriaList";
import { ItemDescription } from "./ItemDescription";
import { ItemRelations, type ItemRelationsProps } from "./ItemRelations";

export function ItemBody({
	item,
	onRewind,
	onCommentDeleted,
}: ItemRelationsProps) {
	return (
		<Box sx={{ pt: 2, flex: 1, minWidth: 0 }}>
			<ItemDescription description={item.description} />
			<AcceptanceCriteriaList criteria={item.acceptanceCriteria} />
			<ItemRelations
				item={item}
				onRewind={onRewind}
				onCommentDeleted={onCommentDeleted}
			/>
		</Box>
	);
}
