import { Box, Stack, Typography } from "@mui/material";
import type { BacklogComment } from "../types";
import { CommentCard } from "./CommentCard";
import { itemSectionAnchor } from "./itemSectionAnchor";
import { sectionHeadingSx } from "./sectionHeadingSx";

export function CommentsSection({
	comments,
	itemId,
	onCommentDeleted,
}: {
	comments: BacklogComment[];
	itemId?: number;
	onCommentDeleted?: () => Promise<void>;
}) {
	if (comments.length === 0) return null;
	return (
		<Box {...itemSectionAnchor("comments")}>
			<Typography variant="overline" sx={sectionHeadingSx}>
				Comments
			</Typography>
			<Stack spacing={1}>
				{comments.map((c, i) => (
					<CommentCard
						key={`${c.timestamp}-${i}`}
						comment={c}
						itemId={itemId}
						onDeleted={onCommentDeleted}
					/>
				))}
			</Stack>
		</Box>
	);
}
