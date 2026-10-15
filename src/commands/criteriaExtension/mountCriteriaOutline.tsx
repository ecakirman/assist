import type { Root } from "react-dom/client";
import { CriteriaOutlineHost } from "./CriteriaOutlineHost";
import { renderInShadow } from "./renderInShadow";

/**
 * The theme inherits the page's font and paints no background of its own, so
 * the control sits on GitHub's own surface.
 */
export function mountCriteriaOutline(
	host: HTMLElement,
	initialBody: string,
	onBody: (body: string) => void,
): Root {
	return renderInShadow(
		host,
		"assist-criteria",
		<CriteriaOutlineHost initialBody={initialBody} onBody={onBody} />,
	);
}
