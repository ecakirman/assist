import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { reviewButtonModes } from "../../../../../../../../shared/reviewButtonModes";
import { ReviewOptionToggles } from "../../../ReviewOptionToggles";
import type { useReviewLaunch } from "./useReviewLaunch";

export function ReviewButtonMenu({
	anchorEl,
	onClose,
	review,
	openHighLevel,
}: {
	anchorEl: HTMLElement | null;
	onClose: () => void;
	review: ReturnType<typeof useReviewLaunch>;
	openHighLevel?: () => void;
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
				openHighLevel && mode.args.includes("--high-level") ? (
					<MenuItem key={mode.label} onClick={(e) => pick(e, openHighLevel)}>
						Open high-level review
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
