import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { IconButton } from "@mui/material";
import { Decoration } from "react-diff-view";
import { GapStatus } from "./HighLevelGapExpander/GapStatus";

export function HighLevelGapExpander({
	hidden,
	header,
	disabled,
	loading,
	error,
	onExpand,
}: {
	hidden: number;
	header: string;
	disabled: boolean;
	loading: boolean;
	error: string | undefined;
	onExpand: () => void;
}) {
	return (
		<Decoration
			className="high-level-gap"
			gutterClassName="high-level-gap-gutter"
			contentClassName="high-level-gap-content"
		>
			<IconButton
				size="small"
				disabled={disabled}
				onClick={onExpand}
				aria-label={`Show ${hidden} hidden lines`}
			>
				<UnfoldMoreIcon fontSize="small" />
			</IconButton>
			<GapStatus
				hidden={hidden}
				header={header}
				loading={loading}
				error={error}
				onRetry={onExpand}
			/>
		</Decoration>
	);
}
