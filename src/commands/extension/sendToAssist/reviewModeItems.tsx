import { Divider, MenuItem } from "@mui/material";
import { reviewButtonModes } from "../../../shared/reviewButtonModes";
import {
	type ReviewOptions,
	reviewOptionArgs,
} from "../../../shared/reviewOptionFlags";
import { AssistReviewToggles } from "./AssistReviewToggles";

export function reviewModeItems(
	options: ReviewOptions,
	setOptions: (options: ReviewOptions) => void,
	onPick: (args: string[]) => void,
) {
	return [
		...reviewButtonModes.map(({ label, args }) => (
			<MenuItem
				key={label}
				onClick={() => onPick([...args, ...reviewOptionArgs(options)])}
			>
				{label}
			</MenuItem>
		)),
		<Divider key="modes-divider" />,
		<AssistReviewToggles key="toggles" value={options} onChange={setOptions} />,
		<Divider key="toggles-divider" />,
	];
}
