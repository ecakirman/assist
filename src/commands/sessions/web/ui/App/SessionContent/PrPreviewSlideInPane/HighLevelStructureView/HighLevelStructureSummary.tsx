import { Typography } from "@mui/material";
import type { HighLevelStructure } from "../../../../../../../review/highLevel/types";

export function HighLevelStructureSummary({
	structure,
}: {
	structure: HighLevelStructure;
}) {
	return (
		<Typography variant="caption" sx={{ color: "text.secondary" }}>
			{structure.added} added · {structure.removed} deleted ·{" "}
			{structure.modified} modified · +{structure.additions} −
			{structure.deletions}
		</Typography>
	);
}
