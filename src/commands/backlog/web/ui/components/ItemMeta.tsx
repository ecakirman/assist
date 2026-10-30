import { Chip, Stack, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { formatItemId } from "../../../formatItemId";
import type { BacklogItem } from "../types";
import { GithubIssueLink } from "./GithubIssueLink";
import { JiraKeyLink } from "./JiraKeyLink";
import { StatusPicker } from "./StatusPicker";
import { typeChipColors } from "./typeChipColors";
import { UsageSummary } from "./UsageSummary";

const metaRowSx = {
	alignItems: "center",
	color: "text.disabled",
	fontSize: "0.875rem",
} as const;

const chipSx = {
	fontWeight: 500,
	fontSize: "0.75rem",
} as const;

const idSx = (t: Theme) =>
	t.design === "slate"
		? { fontFamily: t.typography.fontFamilyMono, fontSize: 12 }
		: {};

const usageSx = { color: "text.secondary", fontSize: "0.75rem" } as const;

export function ItemMeta({
	item,
	onStatusChange,
}: {
	item: BacklogItem;
	onStatusChange?: (status: BacklogItem["status"]) => void;
}) {
	const slate = useTheme().design === "slate";
	const color = typeChipColors[item.type];
	return (
		<Stack direction="row" spacing={slate ? 0.75 : 1} sx={metaRowSx}>
			<Typography variant="body2" color="text.disabled" sx={idSx}>
				{formatItemId(item.id)}
			</Typography>
			{color && (
				<Chip
					label={item.type}
					size="small"
					color={color}
					sx={slate ? undefined : chipSx}
				/>
			)}
			<StatusPicker current={item.status} onStatusChange={onStatusChange} />
			<JiraKeyLink jiraKey={item.jiraKey} />
			<GithubIssueLink githubIssue={item.githubIssue} origin={item.origin} />
			{item.usageTotal && <UsageSummary total={item.usageTotal} sx={usageSx} />}
		</Stack>
	);
}
