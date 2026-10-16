import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { reviewButtonModes } from "../../../../../../../../shared/reviewButtonModes";
import { ReviewOptionToggles } from "../../../ReviewOptionToggles";
import type { HighLevelReviewAction } from "./useHighLevelReviewAction";
import type { useReviewLaunch } from "./useReviewLaunch";

export function ReviewButtonMenu({
	anchorEl,
	onClose,
	review,
	highLevel,
}: {
	anchorEl: HTMLElement | null;
	onClose: () => void;
	review: ReturnType<typeof useReviewLaunch>;
	highLevel?: HighLevelReviewAction | undefined;
}) {
	const pick = (e: { stopPropagation: () => void }, run: () => void) => {
		e.stopPropagation();
		onClose();
		run();
	};

	return (
		<Menu
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			onClose={onClose}
			onClick={(e) => e.stopPropagation()}
		>
			{reviewButtonModes.map((mode) =>
				highLevel && mode.args.includes("--high-level") ? (
					<MenuItem key={mode.label} onClick={(e) => pick(e, highLevel.run)}>
						{highLevel.label}
					</MenuItem>
				) : (
					<MenuItem
						key={mode.label}
						onClick={(e) => pick(e, () => review.launchMode(mode.args))}
					>
						{mode.label}
					</MenuItem>
				),
			)}
			<Divider />
			<ReviewOptionToggles
				value={review.options}
				onChange={review.setOptions}
			/>
			<Divider />
			<MenuItem onClick={(e) => pick(e, review.launchAddressComments)}>
				Address Comments
			</MenuItem>
		</Menu>
	);
}
