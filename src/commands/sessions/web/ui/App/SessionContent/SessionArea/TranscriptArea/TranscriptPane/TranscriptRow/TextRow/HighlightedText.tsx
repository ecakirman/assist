import { Fragment } from "react";
import { splitOnTerm } from "./HighlightedText/splitOnTerm";
import { SearchMark } from "../../../../../../SearchMark";

export function HighlightedText({
	text,
	term,
}: {
	text: string;
	term: string;
}) {
	return splitOnTerm(text, term).map((s) =>
		s.match ? (
			<SearchMark key={s.start}>{s.text}</SearchMark>
		) : (
			<Fragment key={s.start}>{s.text}</Fragment>
		),
	);
}
