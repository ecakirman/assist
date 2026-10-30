import { Box, ButtonBase } from "@mui/material";
import type { ItemNavSection } from "./itemNavSections";
import { slateLinkSx, slateNavSx, slatePhasesSx } from "./slateNavSx";
import { SlatePhaseRow } from "./SlatePhaseRow";

type NavProps = {
	sections: ItemNavSection[];
	activeId: string | undefined;
	onSelect: (id: string) => void;
};

type NavGroup = { link: ItemNavSection; phases: ItemNavSection[] };

function groupSections(sections: ItemNavSection[]): NavGroup[] {
	const groups: NavGroup[] = [];
	for (const section of sections) {
		const last = groups.at(-1);
		if (section.nested && last) last.phases.push(section);
		else groups.push({ link: section, phases: [] });
	}
	return groups;
}

function sentenceCase(label: string) {
	return label.charAt(0) + label.slice(1).toLowerCase();
}

export function SlateItemNavigator({ sections, activeId, onSelect }: NavProps) {
	return (
		<Box component="nav" sx={slateNavSx}>
			{groupSections(sections).map(({ link, phases }) => (
				<Box key={link.id} sx={{ display: "contents" }}>
					<ButtonBase
						sx={slateLinkSx(link.id === activeId)}
						onClick={() => onSelect(link.id)}
						aria-current={link.id === activeId ? "true" : undefined}
					>
						{sentenceCase(link.label)}
					</ButtonBase>
					{phases.length > 0 && (
						<Box sx={slatePhasesSx}>
							{phases.map((phase) => (
								<SlatePhaseRow
									key={phase.id}
									section={phase}
									active={phase.id === activeId}
									onSelect={onSelect}
								/>
							))}
						</Box>
					)}
				</Box>
			))}
		</Box>
	);
}
