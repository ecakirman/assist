import { useEffect, useRef } from "react";
import type { TranscriptMessage } from "../../../../../types";

export function useScrollToFirstMark(
	messages: TranscriptMessage[],
	term: string,
) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (term && messages.length > 0)
			ref.current?.querySelector("mark")?.scrollIntoView({ block: "center" });
	}, [messages, term]);

	return ref;
}
