import type { BacklogItem } from "../types";
import { itemNavSections } from "./itemNavSections";
import { SlateItemNavigator } from "./SlateItemNavigator";
import { useActiveSection } from "./useActiveSection";

function scrollToSection(id: string) {
	document
		.getElementById(id)
		?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ItemNavigator({
	item,
	headerHeight,
}: {
	item: BacklogItem;
	headerHeight: number;
}) {
	const sections = itemNavSections(item);
	const activeId = useActiveSection(
		sections.map((section) => section.id),
		headerHeight,
	);
	if (sections.length === 0) return null;
	return (
		<SlateItemNavigator
			sections={sections}
			activeId={activeId}
			onSelect={scrollToSection}
		/>
	);
}
