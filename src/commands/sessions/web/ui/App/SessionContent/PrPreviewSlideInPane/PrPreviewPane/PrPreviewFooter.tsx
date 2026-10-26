import { Divider } from "@mui/material";
import { PrCommentList } from "./PrPreviewFooter/PrCommentList";
import { PrPreviewActions } from "./PrPreviewFooter/PrPreviewActions";
import type { PrPreviewFooterProps } from "./PrPreviewFooterProps";
import { SelectionCommentPopover } from "../../../SelectionCommentPopover";

export function PrPreviewFooter({
	comments,
	commentColors,
	pending,
	cwd,
	unavailable,
	onAdd,
	onQueue,
	onCite,
	onAddRule,
	onRemove,
	onCancel,
	onCollapse,
	onDecision,
	chain,
	editable,
	newPr,
	canStart,
	onChainChange,
}: PrPreviewFooterProps) {
	return (
		<>
			<PrCommentList
				comments={comments}
				colors={commentColors}
				onRemove={onRemove}
			/>
			<Divider />
			<PrPreviewActions
				commentCount={comments.length}
				chain={chain}
				newPr={newPr}
				canStart={canStart}
				onChainChange={onChainChange}
				onApprove={() => onDecision("approve", [])}
				onApproveAndStart={() => onDecision("approve", [], true)}
				onReject={() => onDecision("reject", [])}
				onRequestChanges={() =>
					onDecision(
						"reject",
						comments.map((c) => ({ quote: c.quote, note: c.note })),
					)
				}
			/>
			<SelectionCommentPopover
				pending={pending}
				editable={editable}
				cwd={cwd}
				unavailable={unavailable}
				onAdd={onAdd}
				onQueue={onQueue}
				onCite={onCite}
				onAddRule={onAddRule}
				onCancel={onCancel}
				onCollapse={onCollapse}
			/>
		</>
	);
}
