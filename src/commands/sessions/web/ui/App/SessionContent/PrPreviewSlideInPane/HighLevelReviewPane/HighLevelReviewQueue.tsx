import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import type { PreviewReviewComment } from "../../../../../../shared/PreviewDecision";

function location({ path, startLine, endLine }: PreviewReviewComment): string {
	return startLine === endLine
		? `${path}:${startLine}`
		: `${path}:${startLine}-${endLine}`;
}

export function HighLevelReviewQueue({
	queued,
	onRemove,
}: {
	queued: PreviewReviewComment[];
	onRemove: (index: number) => void;
}) {
	if (queued.length === 0) return null;
	return (
		<Box
			component="section"
			aria-label="Queued review comments"
			sx={{ px: 2, py: 1, maxHeight: 160, overflowY: "auto" }}
		>
			<Typography
				variant="overline"
				sx={{ color: "text.secondary", letterSpacing: 1 }}
			>
				{`Queued for review (${queued.length})`}
			</Typography>
			{queued.map((comment, index) => (
				<Stack
					key={`${location(comment)}:${index}`}
					direction="row"
					spacing={1}
					sx={{ alignItems: "flex-start" }}
				>
					<Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
						<Box component="code" sx={{ fontSize: 12, mr: 1 }}>
							{location(comment)}
						</Box>
						{comment.note}
					</Typography>
					<IconButton
						size="small"
						aria-label={`Remove the queued comment on ${location(comment)}`}
						onClick={() => onRemove(index)}
						sx={{ p: 0.25 }}
					>
						<CloseIcon sx={{ fontSize: 14 }} />
					</IconButton>
				</Stack>
			))}
		</Box>
	);
}
