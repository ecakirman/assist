import { useTheme } from "@mui/material/styles";
import { ClassicCommentList } from "./PrCommentList/ClassicCommentList";
import { SlateCommentList } from "./PrCommentList/SlateCommentList";
import type { LocalComment } from "../usePrComments";

export function PrCommentList(props: {
	comments: LocalComment[];
	colors: string[];
	onRemove: (id: number) => void;
}) {
	const slate = useTheme().design === "slate";
	if (props.comments.length === 0) return null;
	return slate ? (
		<SlateCommentList {...props} />
	) : (
		<ClassicCommentList {...props} />
	);
}
