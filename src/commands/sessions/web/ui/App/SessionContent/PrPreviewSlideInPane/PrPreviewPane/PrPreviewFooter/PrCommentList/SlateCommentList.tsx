import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/material";
import { QuoteBlock } from "../../../../../QuoteBlock";
import {
	slateCommentCardSx,
	slateCommentCloseSx,
	slateCommentsHeadingSx,
	slateCommentsSx,
} from "./slateCommentCardSx";
import type { LocalComment } from "../../usePrComments";

export function SlateCommentList({
	comments,
	colors,
	onRemove,
}: {
	comments: LocalComment[];
	colors: string[];
	onRemove: (id: number) => void;
}) {
	return (
		<Box sx={slateCommentsSx}>
			<Typography sx={slateCommentsHeadingSx}>
				Comments ({comments.length})
			</Typography>
			{comments.map((c, i) => (
				<Box key={c.id} sx={slateCommentCardSx}>
					<QuoteBlock
						text={c.quote}
						sx={{ gridColumn: 1, borderLeft: 2, pl: 1, borderColor: colors[i] }}
					/>
					<Box sx={{ gridColumn: 1, wordBreak: "break-word" }}>{c.note}</Box>
					<IconButton
						aria-label="Remove comment"
						onClick={() => onRemove(c.id)}
						sx={slateCommentCloseSx}
					>
						<CloseIcon />
					</IconButton>
				</Box>
			))}
		</Box>
	);
}
