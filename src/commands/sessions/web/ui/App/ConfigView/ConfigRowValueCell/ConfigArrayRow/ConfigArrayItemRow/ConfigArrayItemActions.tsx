import { useState } from "react";
import type { ConfigNode } from "../../../../../../../../../shared/ConfigNode";
import type { ConfigEntry } from "../../../../../../../../config/readConfigEntries";
import { ConfigArrayItemRemoveDialog } from "./ConfigArrayItemActions/ConfigArrayItemRemoveDialog";
import { configArrayItemActionTitles } from "./ConfigArrayItemActions/configArrayItemActionTitles";
import { ConfigEntryActions } from "../../ConfigEntryActions";
import { configEntrySummary } from "../../configEntrySummary";
import type { useConfigArrayRowEditor } from "../useConfigArrayRowEditor";

type Props = {
	entry: ConfigEntry;
	node: ConfigNode;
	index: number;
	editor: ReturnType<typeof useConfigArrayRowEditor>;
};

export function ConfigArrayItemActions({ entry, node, index, editor }: Props) {
	const [confirming, setConfirming] = useState(false);
	const label = `${entry.key}[${index}]`;
	const ownerScope = editor.itemAt(index)?.owner?.scope;
	const canMoveUp = editor.canMove(index, -1);
	const canMoveDown = editor.canMove(index, 1);
	const titles = configArrayItemActionTitles({
		label,
		summary: configEntrySummary(node, editor.valueOf(index)),
		ownerScope,
		repoKey: entry.repoKey,
		globalConfigFile: entry.globalConfigFile,
		canMoveUp,
		canMoveDown,
	});

	return (
		<>
			<ConfigEntryActions
				label={label}
				disabled={editor.saving}
				open={editor.isOpen(index)}
				titles={titles}
				canMoveUp={canMoveUp}
				canMoveDown={canMoveDown}
				canRemove={ownerScope !== undefined}
				onToggle={() => editor.toggle(index)}
				onDuplicate={() => editor.duplicate(index)}
				onMoveUp={() => void editor.move(index, -1)}
				onMoveDown={() => void editor.move(index, 1)}
				onRemove={() => setConfirming(true)}
			/>
			{confirming && (
				<ConfigArrayItemRemoveDialog
					label={label}
					message={titles.removeConfirm}
					onConfirm={() => void editor.remove(index)}
					onCancel={() => setConfirming(false)}
				/>
			)}
		</>
	);
}
