import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { HighlightedText } from "./TextRow/HighlightedText";

export function TextRow({
	role,
	text,
	term,
}: {
	role: "user" | "assistant";
	text: string;
	term: string;
}) {
	const isUser = role === "user";
	const accent = isUser ? "info.main" : "success.main";
	return (
		<Box
			sx={{
				mb: 1.5,
				pl: 1.5,
				py: 1,
				pr: 1,
				borderLeft: 2,
				borderColor: accent,
				borderTopRightRadius: 1,
				borderBottomRightRadius: 1,
				bgcolor: isUser ? "action.hover" : "transparent",
			}}
		>
			<Typography
				variant="caption"
				sx={{
					color: accent,
					fontWeight: 600,
					display: "block",
					mb: 0.5,
				}}
			>
				{isUser ? "User" : "Assistant"}
			</Typography>
			<Typography
				variant="body2"
				sx={{
					color: "text.primary",
					whiteSpace: "pre-wrap",
					overflowWrap: "anywhere",
					lineHeight: 1.6,
				}}
			>
				<HighlightedText text={text} term={term} />
			</Typography>
		</Box>
	);
}
