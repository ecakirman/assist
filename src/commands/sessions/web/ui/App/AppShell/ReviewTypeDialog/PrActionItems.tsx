import { Divider, MenuItem } from "@mui/material";
import { prActions } from "../../../../../../../shared/prActions";
import type { PrSummary } from "../../../../prList";

export function PrActionItems({
	pr,
	onSelect,
	onCancel,
}: {
	pr: PrSummary;
	onSelect: (args: string[]) => void;
	onCancel: () => void;
}) {
	return (
		<>
			{prActions.map(({ label, args }) => (
				<MenuItem key={label} onClick={() => onSelect(args)}>
					{label}
				</MenuItem>
			))}
			<Divider />
			<MenuItem
				onClick={() => {
					window.open(pr.url, "_blank");
					onCancel();
				}}
			>
				Open in GitHub
			</MenuItem>
		</>
	);
}
