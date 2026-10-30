import { SlateCommentList } from "./PrCommentList/SlateCommentList";
import type { LocalComment } from "../usePrComments";

export function PrCommentList(props: {
	comments: LocalComment[];
	colors: string[];
	onRemove: (id: number) => void;
}) {
	if (props.comments.length === 0) return null;
	return <SlateCommentList {...props} />;
}
