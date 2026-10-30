import Badge from "@mui/material/Badge";
import Tab, { type TabProps } from "@mui/material/Tab";
import Tooltip from "@mui/material/Tooltip";
import { ChordTooltipTitle } from "../../../ChordTooltipTitle";
import { useShortcut } from "../../../useShortcut";
import { navTabChord } from "./NavTab/navTabChord";

const badgeSx = { "& .MuiBadge-badge": { right: -10 } } as const;

export function NavTab({
	index,
	label,
	count,
	...props
}: TabProps & { index: number; label: string; count?: number }) {
	const { chords } = useShortcut("navTab");
	return (
		<Tooltip
			describeChild
			title={
				<ChordTooltipTitle
					label={label}
					chords={[navTabChord(chords, index)]}
				/>
			}
		>
			<Tab
				label={
					count ? (
						<Badge badgeContent={count} color="secondary" sx={badgeSx}>
							{label}
						</Badge>
					) : (
						label
					)
				}
				{...props}
			/>
		</Tooltip>
	);
}
